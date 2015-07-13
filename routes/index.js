/**
 * Created by Andriy Ermolenko on 7/28/14.
 */

exports.index = function(req, res) {
    res.render('index');
};

exports.error = function(req, res) {
    res.render('error');
};