import fetch from 'unfetch';

const checkStats = res => {
    if (res.ok) return res;
    const err = new Error(res.statusText);
    err.response = res;
    return Promise.reject(err);
}

export const getAllStudents = () =>
    fetch('api/v1/students').then(checkStats);

export const addNewStudent = student =>
    fetch('api/v1/students', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(student)
        }
    ).then(checkStats)

export const deleteStudent = studentID =>
    fetch(`api/v1/students/${studentID}`, {
        method: 'DELETE',
    }).then(checkStats)
