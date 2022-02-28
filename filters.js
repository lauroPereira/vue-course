Vue.filter('score', function (team) {
    return team.gm - team.gs;
});

Vue.filter('emphasis', function (value) {
    str = (value === 0) ? '' : (value > 1 || value < -1) ? ' pts' : ' pt';
    return value + str;
});