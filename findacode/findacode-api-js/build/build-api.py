from httplib2 import Http
import simplejson as json
import sys, os, mmap

def camelCase(pieces):
  return pieces[0] + ''.join( x.capitalize() for x in pieces[1:] )

def processMethod(outputFile, groupName, blockName, methodUri):
  # Get endpoint manifest
  h = Http()
  resp, content = h.request('http://localhost' + methodUri + '?docs', 'GET')
  methodManifest = json.loads(content)
  
  # Additional method information
  methodNameParts = blockName.split('-') + methodUri.split('/')[-1].split('-')
  methodName = camelCase( filter(len, methodNameParts) )
  requiredParams = {}
  optionalParams = {}
  
  # Separate out required vs optional params
  for param,val in methodManifest['data']['params'].items():
    if val['required']:
      requiredParams[param] = camelCase( param.split('-') )
    else:
      optionalParams[param] = camelCase( param.split('-') )
  
  # Create method declaration
  declaredParams = requiredParams.values()
  if len(optionalParams) > 0:
    declaredParams.append( 'optionalParams' )
  methodContent = (
    "  FAC.api." + groupName + "." + methodName +
    " = function(" + ', '.join( declaredParams ) + ") {\n"
    "    var postData = {"
  )
  
  # Get list of required param entries for postData
  if len(requiredParams):
    requiredPostParams = ["      '" + p[0] + "': " + p[1] for p in requiredParams.items()]
    methodContent += "\n" + ",\n".join( requiredPostParams ) + "\n    };\n"
  else:
    methodContent += " };\n"
  
  # If there are optional params...
  if len(optionalParams) > 0:
    
    # Create optional param object
    methodContent += "\n    var validOptions = {"
    validOptions = ["      '" + p[0] + "': '" + p[1] + "'" for p in optionalParams.items()]
    methodContent += "\n" + ",\n".join( validOptions ) + "\n    };\n\n"
  
    # Add checkOptionalParams() call
    methodContent += "    checkOptionalParams(postData, validOptions, optionalParams);\n"
  
  # Create FAC.api() call
  methodContent += (
    "\n    return FAC.api({\n"
    "      'url': '" + methodUri[4:] + "',\n"
    "      'data': postData\n"
    "    });\n"
    "  };\n\n"
  )
  
  outputFile.write( methodContent )

def processBlock(outputFile, additionalString, groupName, blockManifest):
  
  # If this is an endpoint, skip to processing it
  if 'children' not in blockManifest:
    processMethod(outputFile, groupName, '', blockManifest['uri'])
  
  # If this is a group of endpoints...
  else: 
    blockName = blockManifest['uri'].split('/')[-1]
    blockHeader = (
      "  //\n"
      "  // " + blockName.replace('-',' ') + "\n"
      "  //\n\n"
    )
    outputFile.write(blockHeader)  
   
    # Process the children
    for child in blockManifest['children']:
      processMethod(outputFile, groupName, blockName, child['uri'])
      
    # Pull in additional methods for this group, if any exist
    getAdditionalMethods( outputFile, additionalString, blockManifest['uri'] )

def processGroup(outputFile, additionalString, groupManifest):
  groupName = groupManifest['uri'].split('/')[-1].replace('-', '')
  groupHeader = (
    "  /*\n"
    "   * " + groupName.capitalize() + "\n"
    "   */\n\n"
    "  FAC.api." + groupName + " = {};\n\n"
  )
  outputFile.write(groupHeader)
  
  # Process child methods
  for child in groupManifest['children']:
    processBlock(outputFile, additionalString, groupName, child)
  
  # Pull in additional methods for this group, if any exist
  getAdditionalMethods( outputFile, additionalString, groupManifest['uri'] )
  
  return file

def getAdditionalMethods( outputFile, additionalString, uri ):
  
  # Search for the uri's comment
  comment = '/*** ' + uri + ' ***/'
  index = additionalString.find( comment )
  if index >= 0:
    
    start = index + len(comment)
    
    # Find the next comment
    end = additionalString.find( '/***', start )
    
    # Write all lines after the comment block to the output file
    # until we reach a new comment block or the end of the file
    outputFile.write( "  " + additionalString[start:end].strip() + "\n\n" )
  else:
    return

# cd to the directory of the script so that relative file paths work
os.chdir( os.path.dirname( os.path.abspath(__file__) ) )
    
# Get manifest and objectify it
# Fetch if from localhost so that we get the current development version
h = Http()
resp, content = h.request('http://localhost/v2/system/manifest/api', 'GET')
apiManifest = json.loads(content)

# Open the file that contains the additional methods
additionalString = open('../src/fac/fac.api.additional.js', 'r').read()

# Open output file and write the header
outputFile = open('../src/fac/fac.api.js', 'w')
apiHeader = (
  "/*\n"
  " * FAC JavaScript API\n"
  " */\n"
  "(function($){\n\n"
)
outputFile.write( apiHeader )

# Add utility and other global functions
getAdditionalMethods( outputFile, additionalString, '/v2' )

# Process the manifest
for child in apiManifest['data']['children']:
  processGroup(outputFile, additionalString, child)

# Write the footer and close the file
outputFile.write( "}(FAC));" )
outputFile.close()  