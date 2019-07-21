import json
import os
import sys

dir = str(sys.argv[1])

sumTotal = 0
sumSuccess = 0
sumFail = 0

print 'Start'

for f in os.listdir(dir):
    # choose files only
    if os.path.isfile(os.path.join(dir, f)):
        # choose .json
        if f.endswith('.json'):
            # load json
            filePath = os.path.join(dir, f)
            filePathHtml = os.path.join(dir, f.replace('.json', '.html'))
            try:
                with open(filePath) as json_file:
                    data = json.load(json_file)
                    sumTotal += data["stats"]["tests"]
                    sumSuccess += data["stats"]["passes"]
                    sumFail += data["stats"]["failures"]
                    # delete all passed suites
                    try:
                        if data["stats"]["failures"] == 0:
                            os.remove(filePathHtml)
                    except:
                        print 'ERROR: cannot delete ', filePathHtml
            except:
                print 'ERROR: cannot parse ', filePath

# print result
print 'Parse results:'
print 'Total tests: ', sumTotal
print 'Succeded tests: ', sumSuccess
print 'Failed tests: ', sumFail

# write result to files
try:
    TESTS_TOTAL = open(os.path.join(dir, 'TESTS_TOTAL'), 'w')
    TESTS_TOTAL.write(str(sumTotal))
    TESTS_TOTAL.close()
    TESTS_SUCCESSED = open(os.path.join(dir, 'TESTS_SUCCESSED'), 'w')
    TESTS_SUCCESSED.write(str(sumSuccess))
    TESTS_SUCCESSED.close()
    TESTS_FAILED = open(os.path.join(dir, 'TESTS_FAILED'), 'w')
    TESTS_FAILED.write(str(sumFail))
    TESTS_FAILED.close()
except:
    print 'Failed to write results file'

print 'End'
