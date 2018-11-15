// this is NOT for validation
// this is simply to take out of the request body only the info needed

// in updating a course, for example, will not need the ref'ed course.id,
// in fact, update fails if it is present
// so this 'parses' the bodyProperties and takes only the data that is needed

// in current version of course-api,
// for updating a document compiled from course or user schema models
// reviews dont get updated

// parsing for userSchema is for future version...
// user docs may have email address updated and/or password reset

// may make this a pre-update hook of some-kind
module.exports = function(schemaName, bodyProperties){

  var data = {};

 // 1-liners for inner-if-statements to keep this short and sweet

  if (schemaName.modelName === 'course'){

    if (bodyProperties.title){data.title = bodyProperties.title};
    if (bodyProperties.description){data.description = bodyProperties.description};
    if (bodyProperties.estimatedTime){data.estimatedTime = bodyProperties.estimatedTime};
    if (bodyProperties.materialsNeeded){data.materialsNeeded = bodyProperties.materialsNeeded};
    if (bodyProperties.steps){data.steps = bodyProperties.steps;}

  } else if (schemaName.modelName === 'user'){

    if (bodyProperties.emailAddress){data.emailAddress = bodyProperties.emailAddress;};
    if (bodyProperties.password){data.password = bodyProperties.pasword;}

  }

  return data;
}
