/**
 * Created by Alec on 11/13/2014.
 */
var expect = require('expect.js')

describe("find picture with average closest to provided", function() {
    var target1 = [0, 120, 200]
    var target2 = [10, 10, 10]
    var options = [["1", [5, 110, 210]], ["2", [100, 100, 100]], ["3", [15, 10, 5]], ["4", [0, 0, 0]]]

    it("should pick option 1 for target 1", function(done) {
        var chosen = getClosestPicture(target1, options, 10)
        expect(chosen).to.eql("1")
        done()
    })
    it("should pick option 3 for target 2", function (done) {
        var chosen = getClosestPicture(target2, options, 10)
        expect(chosen).to.eql("3")
        done()
    })
})

function getClosestPicture(targetColors, possiblePictures, error) {
    var currError = error
    var currPic = null
    while(currError < 256)
    {
        for (var i=0; i < possiblePictures.length; i++) {
            currPic = possiblePictures[i];
            var diffR = Math.abs(targetColors[0] - currPic[1][0]);
            var diffG = Math.abs(targetColors[1] - currPic[1][1]);
            var diffB = Math.abs(targetColors[2] - currPic[1][2]);
            if (diffR < currError && diffG < currError && diffB < currError) {
                return currPic[0]
            }
        }
        currError += 5
    }
    console.log("No picture found")
    return currPic[0]
}