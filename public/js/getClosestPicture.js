/**
 * Created by Alec on 11/11/2014.
 */
/**
 * NO LONGER IN USE
 * Finds the first picture close enough to the target colors from a list of picture's average colors
 * @param targetColors An array with the target color values [R,G,B]
 * @param possiblePictures An array of arrays of images and average color pairs to search through
 * @param error The allowed difference between a picture and the target
 * @returns {*} The local image file to be used
 */
function getClosestPicture(targetColors, kdTree) {
    var currError = error
    // When error is 256, any image should suffice
    while(currError < 256)
    {
        for (var i=0; i < possiblePictures.length; i++) {
            var currPic = possiblePictures[i];
            var diffR = Math.abs(targetColors[0] - currPic[1][0]);
            var diffG = Math.abs(targetColors[1] - currPic[1][1]);
            var diffB = Math.abs(targetColors[2] - currPic[1][2]);
            if (diffR < currError && diffG < currError && diffB < currError) {
                return currPic[0]
            }
        }
        // Increment the allowed error and try again. Simple way to find closest image
        currError += 5
    }
    console.log("No picture found")
    // As a fallback, return the last picture
    return possiblePictures[0][0]
}
/* Uncomment to run tests
exports.getClosestPicture = function(targetColors, possiblePictures, error) {
    return getClosestPicture(targetColors, possiblePictures, error)
}
*/