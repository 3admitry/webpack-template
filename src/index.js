//import './style.css'
import './styles/index.scss'
import $ from 'jquery'
import 'bootstrap'

const userStack ={
    language: 'JavaScript',
    framework: 'Vue',
}

const user = {
    name: 'Dmitry',
    age: '33',
    ...userStack,
}
$('.qjuery_block').html('Text inserted by jQuery lib')

console.log(user)