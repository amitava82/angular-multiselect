
fs = require 'fs'
chai = require 'chai'

chai.use require 'chai-fs'
expect = chai.expect

jshint = require 'gulp-jshint'
gutil = require 'gulp-util'

modulePath = '../'

# ----------------------------------------------------------------------------

describe 'gulp-jshint', ->
  sloppyFile = undefined
  cleanFile = undefined


  beforeEach ->
    sloppyFile = new gutil.File(
      path: "./test/fixtures/sloppy.js"
      cwd: "./test/fixtures/"
      base: "./test/fixtures/"
      contents: fs.readFileSync "./test/fixtures/sloppy.js"
    )
    cleanFile = new gutil.File(
      path: "./test/fixtures/clean.js"
      cwd: "./test/fixtures/"
      base: "./test/fixtures/"
      contents: fs.readFileSync "./test/fixtures/clean.js"
    )
    return


  it "should get the reporter function", ->
    reporter = jshint.reporter modulePath
    EventEmitter = require 'events'
    (expect reporter).to.be.an.instanceof EventEmitter
    return


  it 'should pass through files', (done) ->
    reporter = jshint.reporter modulePath
    count = 0

    reporter.on 'data', (f) ->
      expect(f).to.exist
      expect(f.path).to.be.a.file
      count++

    reporter.once 'end', ->
      expect(count).to.equal 2
      done()

    reporter.write sloppyFile
    reporter.write cleanFile
    reporter.end()
