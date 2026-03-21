// solve leetcode majority element problem https://leetcode.com/problems/majority-element/description/?envType=study-plan-v2&envId=top-interview-150

var majorityElement = function(nums) {
    let obj = {};

    for (let num of nums) {
        if (obj[num]) {
            obj[num]++;
        } else {
            obj[num] = 1;
        }
    }
    x = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
    return parseInt(x);    
}


console.log(majorityElement([1,1,1,2,3,1,5,1,6,5,6,6,6,6,6,6,6,6]));
