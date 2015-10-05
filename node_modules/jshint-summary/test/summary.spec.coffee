
fs = require "fs"
expect = (require "chai").expect

# Path to actual reporter's module
summaryPath = "../lib/summary"


# ----------------------------------------------------------------------------

describe "summary.coffee", ->

  it "should export an object with the reporter function", ->
    exported = require summaryPath

    expect exported
      .to.be.an "object"
      .and.to.have.keys "reporter"

    expect exported.reporter
      .to.be.a "function"


  it "should generate a table of warnings"


  it "should generate statistics when statistics option is true"
