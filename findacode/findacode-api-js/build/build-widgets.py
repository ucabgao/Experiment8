import os, sys, simplejson as json, shutil, subprocess, distutils.dir_util, argparse

# basePath = '/srv/www/api/widgets/v2'
# srcPath = os.path.join(basePath, 'src')
# srcStylesPath = os.path.join(srcPath, 'styles')
# buildStylesPath = os.path.join(basePath, 'styles')
# imagesPath = os.path.join(srcPath, 'images')

srcPath = 'src'
srcStylesPath = os.path.join(srcPath, 'styles')
imagesPath = os.path.join(srcPath, 'images')
outputPath = 'bin'
buildStylesPath = os.path.join(outputPath, 'styles')

manifest = {}

def processJSFile(outputFile, filename, widgetname):
  global manifest
  readFile = open(filename, 'r')
  linenumber = 0
  capturing = False
  jsonString = ''
  fileString = ''
  for line in readFile:
    linenumber += 1
    if linenumber == 1:
      if line.rstrip() != "/***":
        outputFile.write(open(filename, 'r').read())
        outputFile.write("\n")
        return
      else:
        capturing = True
        continue
    else:
      if line.rstrip() == "***/":
        capturing = False
        continue
        
    if capturing:
      jsonString += line
    else:
      fileString += line
  try:
    jsonObj = json.loads(jsonString)
  except:
    print "invalid json in " + filename + "... Aborting"
    sys.exit()
  
  #if fac-dev, set whole manifest
  if filename == "src/fac/fac.js":
    manifest = jsonObj
  else:
    manifest['widgets'][widgetname] = jsonObj
  
  outputFile.write(fileString)
  outputFile.write("\n")

def processFile(outputFile, filename):
  readFile = open(filename, 'r').read()
  outputFile.write(readFile)
  outputFile.write("\n")

  
# Create bin and bin/styles folders
if not os.path.exists(buildStylesPath):
  os.makedirs(buildStylesPath)  
  
# Load config file
buildConfig = json.load(open(os.path.join('build', 'build-widgets.conf'), 'r'))

# Build FAC.api.js
apiOutput = open(os.path.join(outputPath, 'FAC.api.js'), 'w')
for jsFile in buildConfig['api']:
  processJSFile(apiOutput, os.path.join(srcPath, jsFile), '')
apiOutput.close()

# Build libs.js
libsOutputPath = os.path.join(outputPath, 'libs.js')
libsOutput = open(libsOutputPath, 'w')
for jsFile in buildConfig['libs']:
  processJSFile(libsOutput, os.path.join(srcPath, jsFile), '')
libsOutput.close()

# Build FAC.src.js
facSrcOutputPath = os.path.join(outputPath, 'FAC.src.js')
facSrcOutput = open(facSrcOutputPath, 'w')
for jsFile in buildConfig['js']:
  processJSFile(facSrcOutput, os.path.join(srcPath, jsFile), jsFile.split('/')[-1].split('.')[0])
facSrcOutput.close()

# Build FAC.dev.js
facDevOutput = open(os.path.join(outputPath, 'FAC.dev.js'), 'w')
shutil.copyfileobj(open(libsOutputPath, 'rb'), facDevOutput)
shutil.copyfileobj(open(facSrcOutputPath, 'rb'), facDevOutput)
facDevOutput.close()

# Build FAC.js
facJsOutputPath = os.path.join(outputPath, 'FAC.js')
facJsOutput = open(facJsOutputPath, 'w')
shutil.copyfileobj(open(libsOutputPath, 'rb'), facJsOutput)
facJsOutput.close()
os.system("uglifyjs " + facSrcOutputPath + " >> " + facJsOutputPath)

# Save Manifest
manifestOutput = open(os.path.join(outputPath, 'FAC-manifest.json'), 'w')
manifestOutput.write(json.dumps(manifest))
manifestOutput.close()

# Build FAC-widgets.css
widgetCSSPath = os.path.join(buildStylesPath, 'FAC-widgets.css')
widgetCSSFile = open(widgetCSSPath, 'w')
for cssFile in buildConfig['css']:
  processFile(widgetCSSFile, os.path.join(srcPath, cssFile))
widgetCSSFile.close()

# Build styles
for uiStyle in buildConfig['styles']:
  thisStylesBuildPath = os.path.join(buildStylesPath, uiStyle)
  thisStylesSrcPath = os.path.join(srcStylesPath, uiStyle)
  
  # Create the style's build directory if it doesn't exist
  if not os.path.exists(thisStylesBuildPath):
    os.makedirs(thisStylesBuildPath)
  
  styleCSSFile = open(os.path.join(thisStylesBuildPath, 'FAC.css'), 'w')
  
  # Include base jquery ui css
  processFile(styleCSSFile, os.path.join(thisStylesSrcPath, 'jquery.css'))
  
  # Include widget css
  processFile(styleCSSFile, widgetCSSPath)
  
  # Copy jQuery UI images
  # distutils.dir_util is used because shutil.copytree requires that the destination directory does not exist
  distutils.dir_util.copy_tree(os.path.join(thisStylesSrcPath, 'images'), os.path.join(thisStylesBuildPath, 'images'))
  
  # Copy FAC images
  for imageFile in buildConfig['images']:
    try:
      shutil.copyfile(os.path.join(imagesPath, imageFile), os.path.join(thisStylesBuildPath, 'images', imageFile))
    except Exception as e:
      print 'Unable to copy image %s' % imageFile
      print e
  
  # Package and compress
  # subprocess.call(["tar", "-czf", os.path.join(srcStylesPath, uiStyle + '.tgz'), "-C", srcStylesPath, uiStyle])