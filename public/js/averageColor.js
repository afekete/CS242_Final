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
    var averageColors = [];
    // Loop over whole picture in increments of subWidth and subHeight
    for(var x = 0; x < totWidth; x+=subWidth) {
        for(var y = 0; y < totHeight; y+=subHeight) {
            var avgR = 0;
            var avgG = 0;
            var avgB = 0;
            // Loop over subpictures
            for(var x_sub = x; x_sub < x+subWidth; x_sub++) {
                for(var y_sub = y; y_sub < y+subHeight; y_sub++) {
                    // Get array index for current position and sum sum squares of rgb values over the area
                    var currIndex = getIndex(x_sub, y_sub, totWidth, totHeight);
                    avgR += Math.pow(image[currIndex],2);
                    avgG += Math.pow(image[currIndex+1],2);
                    avgB += Math.pow(image[currIndex+2],2);
                }
            }
            // Compute root mean square and take floor
            var pixelCt = subWidth*subHeight;
            avgR /= pixelCt
            avgR = Math.sqrt(avgR)
            avgG /= pixelCt
            avgG = Math.sqrt(avgG)
            avgB /= pixelCt
            avgB = Math.sqrt(avgB)

            averageColors.push([Math.floor(avgR), Math.floor(avgG), Math.floor(avgB)]);
        }
    }
    return averageColors;
}

/**
 * Return the index in the array corresponding to the 2d coordinates given
 * @param x X coordinate
 * @param y Y coordinate
 * @param w Total width of the image
 * @returns {number} the index in the array corresponding to the 2d coordinates given
 */
function getIndex(x, y, w) {
    // Each row takes w*4 elements of the array. Multiply by number of rows and add x*4.
    return (y*w*4)+(x*4)
}
/* Uncomment to run tests
exports.getAvgColors = function(image, totWidth, totHeight, subWidth, subHeight) {
    return getAvgColors(image, totWidth, totHeight, subWidth, subHeight)
}
*/