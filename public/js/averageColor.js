/**
 * Created by Alec on 11/11/2014.
 */
/**
 * Returns an array of average colors of the subimages of an image
 * @param image A 1d array of pixel color values laid out as RGBARGBA...
 * @param totWidth The image width
 * @param totHeight The image height
 * @param subWidth The width of the subsections
 * @param subHeight The height of the subsections
 * @returns {Array} The array of average colors
 */
function getAvgColors(image, totWidth, totHeight, subWidth, subHeight) {
    var avgColors = [];
    for(x = 0; x < totWidth; x+subWidth) {
        for(y = 0; y < totHeight; y+subHeight) {
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
            avgColors.append([avgR, avgG, avgB]);
        }
    }
    return avgColors;
}

function getIndex(x, y, w, h) {
    return (y*w*4)+(x*4)
}