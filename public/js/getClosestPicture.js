/**
 * Created by Alec on 11/11/2014.
 */
/**
 * Finds the first picture close enough to the target colors from a list of picture's average colors
 * @param targetColors An array with the target color values [R,G,B]
 * @param possiblePictures An array of average colors of pictures to search through
 * @param error The allowed difference between a picture and the target
 * @returns {*} The position of the chosen picture in the possiblePictures array
 */
function getClosestPicture(targetColors, possiblePictures, error) {
    var currError = error
    var currPic = null
    var i
    while(currError < 256)
    {
        for (i in possiblePictures.length) {
            currPic = possiblePictures[i];
            var diffR = Math.abs(targetColors[0] - currPic[1][0]);
            var diffG = Math.abs(targetColors[1] - currPic[1][1]);
            var diffB = Math.abs(targetColors[2] - currPic[1][2]);
            if (diffR < error && diffG < error && diffB < error) {
                return currPic[0]
            }
        }
        currError += 5
    }
    console.log("No picture found")
    return currPic[0]
}