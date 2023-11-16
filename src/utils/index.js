// export const API_LINK = "http://localhost:8000";

const user = JSON.parse(localStorage.getItem('userInfo'))?._id;

export const findOtherUser = (users) => {
    // console.log(users);
    const otheruser = users.filter((val) => val._id != user);
    // console.log(otheruser);
    return otheruser;
}
