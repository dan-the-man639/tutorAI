const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const RENDERS_DIR = path.join(__dirname, 'renders');
if (!fs.existsSync(RENDERS_DIR)) {
  fs.mkdirSync(RENDERS_DIR);
}

function pythonExecutable() {
  if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH;
  return process.platform === 'win32' ? 'python' : 'python3';
}

/**
 * Render a manim scene.
 * @param {string} sceneFile - python file inside backend/manim_scenes (without .py)
 * @param {string} sceneClass - Scene class name inside the file
 * @param {object} [options]
 * @returns {Promise<string>} Resolves to the relative video path (e.g. /renders/abc.mp4)
 */
function renderScene(sceneFile, sceneClass, options = {}) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputName = `${sceneClass}_${timestamp}`;
    const width = options.width || 1280;
    const height = options.height || 720;

    // Allow calling with an absolute/relative .py path in addition to a scene name inside backend/manim_scenes
    let scenePath;
    if (sceneFile.endsWith('.py') || sceneFile.includes(path.sep)) {
      // Provided path already points to a .py file
      scenePath = sceneFile;
    } else {
      // Legacy behaviour – look up inside backend/manim_scenes
      scenePath = path.join('manim_scenes', `${sceneFile}.py`);
    }

    const pythonArgs = [
      '-m',
      'manim',
      scenePath,
      sceneClass,
      '-qk', // medium quality
      '-r', `${width},${height}`,
      '--format', 'mp4',
      '--media_dir', RENDERS_DIR,
      '--output_file', outputName,
    ];

    // initialize stderr buffer before listeners
    let stderr = '';

    const py = spawn(pythonExecutable(), pythonArgs, { cwd: __dirname, shell: false });
    py.stdout.on('data', (d) => console.log(`[manim] ${d.toString()}`));
    py.stderr.on('data', (data) => {
      const txt = data.toString();
      stderr += txt;
      console.error(`[manim-err] ${txt}`);
    });

    function findFile(startDir, targetName) {
      const entries = fs.readdirSync(startDir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(startDir, entry.name);
        if (entry.isDirectory()) {
          const found = findFile(full, targetName);
          if (found) return found;
        } else if (entry.isFile() && entry.name === targetName) {
          return full;
        }
      }
      return null;
    }

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Manim exited with ${code}: ${stderr}`));
      }
      const fileName = `${outputName}.mp4`;
      const expected = path.join(RENDERS_DIR, fileName);
      let sourcePath = expected;

      if (!fs.existsSync(expected)) {
        const videosRoot = path.join(RENDERS_DIR, 'videos');
        if (fs.existsSync(videosRoot)) {
          const found = findFile(videosRoot, fileName);
          if (found) {
            fs.copyFileSync(found, expected);
          } else {
            return reject(new Error('Rendered video not found.'));
          }
        } else {
          return reject(new Error('Videos directory not found.'));
        }
      }

      resolve(path.join('/renders', fileName));
    });
  });
}

module.exports = { renderScene }; 