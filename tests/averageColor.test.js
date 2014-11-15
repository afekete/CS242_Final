/**
 * Created by Alec on 11/13/2014.
 */
var expect = require('expect.js');
var avg = require('../public/js/averageColor.js')

describe("Get average color of subimages of image", function() {
    var picture = [0,0,0,0,10,20,30,0,0,20,40,0,50,50,50,0];

    it("should find the averages [0,0,0], [10,20,30], [0,20,40], [50,50,50]", function(done) {
        var averages = avg.getAvgColors(picture, 2, 2, 1, 1);
        expect(averages[0]).to.eql([0,0,0]);
        expect(averages[2]).to.eql([10,20,30]);
        expect(averages[1]).to.eql([0,20,40]);
        expect(averages[3]).to.eql([50,50,50]);
        done()
    });

    it("should find the average [15,22,30]", function(done) {
        var averages = avg.getAvgColors(picture, 2, 2, 2, 2);
        expect(averages[0]).to.eql([15,22,30]);
        done()
    })
});
