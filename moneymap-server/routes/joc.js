var express = require('express');
var router = express.Router();

const JOCService = require('../services/joc');
const AuthService = require('../services/auth');

router.post('/', [AuthService.checkToken], async (req, res, next) => {
  const { uid, name, cityid, image } = req.body;

  let result = await JOCService.create(uid, name, cityid, image, req.params.token);
  res.json(result);
});

router.post('/:id/components', [AuthService.checkToken], async (req, res, next) => {
  let results = [];

  for(i in req.body) {
    let component = req.body[i];
    let result = await JOCService.addComponent(req.params.id, component.ctype, component.cdesc, component.camt, req.params.token);
    results.push(result);
  }
  JOCService.updateRFS(req.params.id, req.params.token);
  res.json(results);
});

router.post('/:id', [AuthService.checkToken], async (req, res, next) => {
  const { name, cityid, image, components } = req.body;

  let result = {};
  
  result.update = await JOCService.update(req.params.id, name, cityid, image, req.params.token);

  result.delete = await JOCService.deleteComponents(req.params.id, req.params.token);

  result.addComponents = [];

  for(i in req.body.components) {
    let component = req.body.components[i];
    let addComponentResult = await JOCService.addComponent(req.params.id, component.ctype, component.cdesc, component.camt, req.params.token);
    result.addComponents.push(addComponentResult);
  }
  JOCService.updateRFS(req.params.id, req.params.token);
  res.json(result);
});

router.get('/types', [AuthService.checkToken], async (req, res, next) => {
  let result = await JOCService.getComponentTypes(req.params.token);
  res.json(result);
});

router.get('/:id', [AuthService.checkToken], async (req, res, next) => {
  let result = await JOCService.getComponents(req.params.id, req.params.token);
  res.json(result);
});

router.delete('/:id', [AuthService.checkToken], async (req, res, next) => {
  let result = await JOCService.delete(req.params.id, req.params.token);
  res.json(result);
});

module.exports = router;
