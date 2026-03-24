/**
 * CSS Dead Code Audit
 * 
 * Extracts every class selector from theme.css, checks if it appears
 * in any JS or HTML file. Outputs dead selectors and optionally
 * writes a cleaned CSS file.
 * 
 * Run: node scripts/css-dead-code.js [--clean]
 */

var fs = require('fs');
var path = require('path');

var CSS_FILE = 'assets/css/theme.css';
var CLEAN_FLAG = process.argv.indexOf('--clean') >= 0;

// Gather all source files to search
var SOURCE_DIRS = ['core', 'data', 'campaigns', 'help', 'learn'];
var SOURCE_EXTS = ['.js', '.html', '.htm'];
var EXTRA_FILES = ['index.html', 'about.html', 'design-system.html'];

function getFiles(dir) {
  var results = [];
  try {
    var entries = fs.readdirSync(dir);
    entries.forEach(function(e) {
      var full = path.join(dir, e);
      var stat = fs.statSync(full);
      if (stat.isDirectory()) {
        results = results.concat(getFiles(full));
      } else if (SOURCE_EXTS.some(function(ext) { return e.endsWith(ext); })) {
        results.push(full);
      }
    });
  } catch(e) {}
  return results;
}

var sourceFiles = [];
SOURCE_DIRS.forEach(function(d) { sourceFiles = sourceFiles.concat(getFiles(d)); });
EXTRA_FILES.forEach(function(f) { if (fs.existsSync(f)) sourceFiles.push(f); });

// Read all source content into one big string for fast searching
var allSource = sourceFiles.map(function(f) { return fs.readFileSync(f, 'utf8'); }).join('\n');

// Read CSS
var css = fs.readFileSync(CSS_FILE, 'utf8');

// Extract all class selectors
var classRe = /\.([a-zA-Z][\w-]+)/g;
var allClasses = {};
var m;
while ((m = classRe.exec(css)) !== null) {
  allClasses[m[1]] = true;
}

var classes = Object.keys(allClasses);
var dead = [];
var alive = [];

classes.forEach(function(cls) {
  // Check if class appears in any source file
  // Must appear as a string (className, class=, includes, etc)
  if (allSource.includes(cls)) {
    alive.push(cls);
  } else {
    dead.push(cls);
  }
});

console.log('CSS audit: ' + classes.length + ' classes, ' + alive.length + ' alive, ' + dead.length + ' dead');

if (dead.length > 0) {
  console.log('\nDead selectors (' + dead.length + '):');
  dead.forEach(function(c) { console.log('  .' + c); });
}

// Clean mode: remove rules containing only dead selectors
if (CLEAN_FLAG && dead.length > 0) {
  var deadSet = {};
  dead.forEach(function(c) { deadSet[c] = true; });
  
  // Split CSS into rules and filter
  // Strategy: process line by line, track if current rule's selector contains only dead classes
  var lines = css.split('\n');
  var output = [];
  var inRule = false;
  var ruleLines = [];
  var ruleSelectorLine = '';
  var depth = 0;
  
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var opens = (line.match(/{/g) || []).length;
    var closes = (line.match(/}/g) || []).length;
    
    if (depth === 0 && opens > 0) {
      // Start of a rule — check selector
      ruleSelectorLine = line;
      ruleLines = [line];
      depth += opens - closes;
      if (depth === 0) {
        // Single-line rule
        var selectorPart = line.split('{')[0];
        var selectorClasses = [];
        var sm;
        var selRe = /\.([a-zA-Z][\w-]+)/g;
        while ((sm = selRe.exec(selectorPart)) !== null) {
          selectorClasses.push(sm[1]);
        }
        // Keep if ANY class in selector is alive, or if no classes (element selectors, :root, etc)
        var allDead = selectorClasses.length > 0 && selectorClasses.every(function(c) { return deadSet[c]; });
        if (!allDead) {
          output.push(line);
        }
      }
    } else if (depth > 0) {
      ruleLines.push(line);
      depth += opens - closes;
      if (depth === 0) {
        // End of rule — check if selector is all dead
        var selectorPart2 = ruleSelectorLine.split('{')[0];
        var selectorClasses2 = [];
        var sm2;
        var selRe2 = /\.([a-zA-Z][\w-]+)/g;
        while ((sm2 = selRe2.exec(selectorPart2)) !== null) {
          selectorClasses2.push(sm2[1]);
        }
        var allDead2 = selectorClasses2.length > 0 && selectorClasses2.every(function(c) { return deadSet[c]; });
        if (!allDead2) {
          ruleLines.forEach(function(rl) { output.push(rl); });
        }
        ruleLines = [];
      }
    } else {
      output.push(line);
    }
  }
  
  var cleaned = output.join('\n');
  // Remove excessive blank lines (3+ → 1)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  var saved = css.length - cleaned.length;
  fs.writeFileSync(CSS_FILE, cleaned, 'utf8');
  console.log('\nCleaned: removed ' + saved + ' bytes (' + Math.round(saved/1024) + ' KB)');
  console.log('New size: ' + cleaned.length + ' bytes (' + Math.round(cleaned.length/1024) + ' KB)');
}
