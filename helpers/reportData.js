module.exports = function (userList) {
  let result = [];
  if (userList.length > 0) {
    userList.map(user => {
      // get required data from list
      const { title, firstname, lastname, email, general, personal, nok, choir_roles, church_info } = user;
      const basic = { title, firstname, lastname, email }; //password is off
      const res = Object.assign(basic, general, personal, nok, choir_roles, church_info);
      result.push(res)
    });

    return JSON.stringify(result);

  } else {
    return JSON.stringify(result);
  }
}