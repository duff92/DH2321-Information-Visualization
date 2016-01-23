(function() {
  'use strict';

  describe('service studentData', function() {
    var studentData;

    beforeEach(module('dh2321InformationVisualization'));
    beforeEach(inject(function(_studentData_) {
      studentData = _studentData_;
    }));

    it('should be registered', function() {
      expect(studentData).not.toEqual(null);
    });

    describe('getTec function', function() {
      it('should exist', function() {
        expect(studentData.getStudents).not.toEqual(null);
      });

      it('should return array of object', function() {
        var data = studentData.getStudents();
        expect(data).toEqual(jasmine.any(Array));
        expect(data[0]).toEqual(jasmine.any(Object));
        expect(data.length > 5).toBeTruthy();
      });
    });
  });
})();
