const userStack ={
    language: 'JavaScript',
    framework: 'Vue',
}

const user = {
    name: 'Dmitry',
    age: '33',
    ...userStack,
}

console.log(user)