/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Thing from './thing.model';

//Facebook insights video
import video_140824_150219 from './json/video_140824_150219.json';
import video_150220_150818 from './json/video_150220_150818.json';
import video_150819_160215 from './json/video_150819_160215.json';

//Facebook insights post
import post_140101_140227 from './json/post_140101_140227.json';
import post_140228_140823 from './json/post_140228_140823.json';
import post_140824_150219 from './json/post_140824_150219.json';
import post_150220_150818 from './json/post_150220_150818.json';
import post_150819_160215 from './json/post_150819_160215.json';

//Facebook insights general
import general_140101_140227 from './json/general_140101_140227.json';
import general_140228_140823 from './json/general_140228_140823.json';
import general_140824_150219 from './json/general_140824_150219.json';
import general_150220_150818 from './json/general_150220_150818.json';
import general_150819_160215 from './json/general_150819_160215.json';

let video_data = [video_140824_150219, video_150220_150818, video_150819_160215];
let post_data = [post_140101_140227, post_140228_140823, post_140824_150219, post_150220_150818, post_150819_160215];
let general_data = [general_140101_140227, general_140228_140823, general_140824_150219, general_150220_150818, general_150819_160215];

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondRelevantData(type, res, statusCode){
  statusCode = statusCode || 200;
  let respons = [];
  if(type === 'video'){
    video_data.forEach(function(data){
      data.forEach(function(d){
        respons.push({
          'Permalink': d.Permalink,
          'Post Message': d['Post Message'],
          'Posted': d.Posted,
          'Lifetime Post Total Reach': d['Lifetime Post Total Reach'],
          'Lifetime Post Total Impressions': d['Lifetime Post Total Impressions'],
          'Lifetime Unique 30-Second Views': d['Lifetime Unique 30-Second Views'],
          'Lifetime Total Video Views': d['Lifetime Total Video Views']
        });
      });
    });
    statusCode = 201;
  }
  else if(type === 'posts'){
    post_data.forEach(function(data){
      data.forEach(function(d){
        respons.push({
          'Permalink': d.Permalink,
          'Post Message': d['Post Message'],
          'Type': d.Type,
          'Posted': d.Posted,
          'Lifetime Post Total Reach': d['Lifetime Post Total Reach'],
          'Lifetime Post Total Impressions': d['Lifetime Post Total Impressions'],
          'Lifetime Post Consumptions': d['Lifetime Post Consumptions'],
          'Lifetime Post reach by people who like your Page': d['Lifetime Post reach by people who like your Page'],
          'Lifetime People who have liked your Page and engaged with your post': d['Lifetime People who have liked your Page and engaged with your post'],
          'Lifetime Post Stories by action type - comment': d['Lifetime Post Stories by action type - comment'],
          'Lifetime Post Stories by action type - like': d['Lifetime Post Stories by action type - like'],
          'Lifetime Post Stories by action type - share': d['Lifetime Post Stories by action type - share']
        });
      });
    });
    statusCode = 201;
  }
  else if(type === 'general'){
    general_data.forEach(function(data){
      data.forEach(function(d){
        let date = new Date(d.Date);
        let dd = date.getDate();
        let mm = date.getMonth()+1; //January is 0!

        let yyyy = date.getFullYear();
        if(dd<10){
          dd='0'+dd
        }
        if(mm<10){
          mm='0'+mm
        }
        date = mm+'/'+dd+'/'+yyyy;
        respons.push({
          'Date': date,
          'Lifetime Total Likes': d['Lifetime Total Likes'],
          'Daily Total Reach': d['Daily Total Reach'],
          'Daily Total Impressions': d['Daily Total Impressions'],
          'Daily Page consumptions': d['Daily Page consumptions'],
          'Weekly Page consumptions': d['Weekly Page consumptions'],
          '28 Days Page consumptions': d['28 Days Page consumptions'],
          'Daily Page consumptions by type - link clicks': d['Daily Page consumptions by type - link clicks'],
          'Daily Page consumptions by type - other clicks': d['Daily Page consumptions by type - other clicks'],
          'Daily Page consumptions by type - photo view': d['Daily Page consumptions by type - photo view'],
          'Daily Total Unique Video Views': d['Daily Total Unique Video Views']
        });
      });
    });
    statusCode = 201;
  }
  res.status(statusCode).json(respons);
}

// Gets a list of Things
export function index(req, res) {
  Thing.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  respondRelevantData(req.params.id, res);

 /* Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

// Creates a new Thing in the DB
export function create(req, res) {
  Thing.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
