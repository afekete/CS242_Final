/**
 * Created by Alec on 11/13/2014.
 */
var expect = require('expect.js')
var closest = require('../public/js/getClosestPicture.js')

describe("find picture with average closest to provided", function() {
    var target1 = [0, 120, 200]
    var target2 = [10, 10, 10]
    var options = [["1", [5, 110, 210]], ["2", [100, 100, 100]], ["3", [15, 10, 5]], ["4", [0, 0, 0]]]

    it("should pick option 1 for target 1", function(done) {
        var chosen = closest.getClosestPicture(target1, options, 10)
        expect(chosen).to.eql("1")
        done()
    })
    it("should pick option 3 for target 2", function (done) {
        var chosen = closest.getClosestPicture(target2, options, 10)
        expect(chosen).to.eql("3")
        done()
    })
})
