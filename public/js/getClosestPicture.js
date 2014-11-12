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
    var index = 0;
    while(index < possiblePictures.length) {
        var currPic = possiblePictures[index];
        var diffR = Math.abs(targetColors[0]-possiblePictures[index][0]);
        var diffG = Math.abs(targetColors[1]-possiblePictures[index][1]);
        var diffB = Math.abs(targetColors[2]-possiblePictures[index][2]);
        if(diffR < error && diffG < error && diffB < error) {
            return index
        }
        if(index == possiblePictures.length-1) {
            index = 0;
            error += 5
        }
    }
    return "No pictures found"
}