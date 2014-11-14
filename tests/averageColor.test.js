/**
 * Created by Alec on 11/13/2014.
 */
var expect = require('expect.js');

describe("Get average color of subimages of image", function() {
    var picture = [0,0,0,0,10,20,30,0,0,20,40,0,50,50,50,0];

    it("should find the averages [0,0,0], [10,20,30], [0,20,40], [50,50,50]", function(done) {
        var averages = getAvgColors(picture, 2, 2, 1, 1);
        expect(averages[0]).to.eql([0,0,0]);
        expect(averages[2]).to.eql([10,20,30]);
        expect(averages[1]).to.eql([0,20,40]);
        expect(averages[3]).to.eql([50,50,50]);
        done()
    });

    it("should find the average [15,22,30]", function(done) {
        var averages = getAvgColors(picture, 2, 2, 2, 2);
        expect(averages[0]).to.eql([15,22,30]);
        done()
    })
});

function getAvgColors(image, totWidth, totHeight, subWidth, subHeight) {
    var averageColors = [];
    for(x = 0; x < totWidth; x+=subWidth) {
        for(y = 0; y < totHeight; y+=subHeight) {
            var avgR = 0;
            var avgG = 0;
            var avgB = 0;

            for(x_sub = x; x_sub < x+subWidth; x_sub++) {
                for(y_sub = y; y_sub < y+subHeight; y_sub++) {
                    var currIndex = getIndex(x_sub, y_sub, totWidth, totHeight);
                    avgR += image[currIndex];
                    avgG += image[currIndex+1];
                    avgB += image[currIndex+2];
                }
            }
            var pixelCt = subWidth*subHeight;
            avgR /= pixelCt;
            avgG /= pixelCt;
            avgB /= pixelCt;
            averageColors.push([Math.floor(avgR), Math.floor(avgG), Math.floor(avgB)]);
        }
    }
    return averageColors;
}

function getIndex(x, y, w, h) {
    return (y*w*4)+(x*4)
}