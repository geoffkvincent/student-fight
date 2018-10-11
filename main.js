import Avatar from './Avatar'

class App {
  loaded = false;
  students = [];
  button = document.getElementById('loading_zone')
  leftFighter = document.getElementById('left')
  rightFighter = document.getElementById('right')

  componentDidMount() {
    this.leftFighter.addEventListener('click', () => this.winner('left') )
    this.rightFighter.addEventListener('click', () => this.winner('right') )
    this.button.addEventListener('click', this.pullStudents)
  }

  renderStudents = () => {
    const list = document.getElementById('students');
    list.innerHTML = null;
    this.students.forEach( (student) => {
      const li = document.createElement('li')
      li.innerText = student.name
      list.append(li)
    })
  }

  sample = () => {
    const index = Math.floor(Math.random() * this.students.length)
    const student = this.students[index]
    this.students.splice(index, 1)
    return student
  }

  selectStudents = () => {
    const left = this.sample();
    const right = this.sample();
    this.renderStudents();
    return [left, right]
  }

  placeFighters = (fighting) => {
    const left = Avatar('left', fighting[0])
    const right = Avatar('right', fighting[1])
    const leftBox = document.getElementById('left')
    const rightBox = document.getElementById('right')
    leftBox.innerHTML = left;
    rightBox.innerHTML = right;
    //setTimeout(pickWinner, 1000)
  }

  startFight = () => {
    this.loaded = true
    const left = document.getElementById('left')
    const right = document.getElementById('right')
    left.className = 'left fight-box';
    right.className = 'left fight-box';
    const fighting = this.selectStudents();
    this.placeFighters(fighting)
  }

  pullStudents = () => {
    if (!this.loaded) {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          this.students = JSON.parse(xhr.responseText);
          this.renderStudents()
          document.getElementById('load_students').remove()
          this.startFight();
        }
      }
      xhr.open('GET', 'https://canvas-students.herokuapp.com/api/student_list/64', true)
      xhr.send(null)
    }
  }

  pickWinner = () => {
    const positions = ['left', 'right']
    const index = Math.floor(Math.random() * 2)
    const position = positions[index]
    this.winner(position)
  }

  winner = (position) => {
    const fighter = document.getElementById(`fighter_${position}`);
    const data = fighter.dataset;
    const label = document.getElementById('winner');
    label.innerHTML = `Winner: ${data.name}`;
    this.students.push(data);
    if (this.students.length !== 1) {
      const fighting = this.selectStudents();
      this.placeFighters(fighting);
    } else {
      const avatar = Avatar(position, data);
      const div = document.createElement('div');
      div.className = 'winner';
      div.innerHTML = avatar;
      const left = document.getElementById('left');
      const right = document.getElementById('right');
      const fightZone = document.getElementById('fight_zone');
      left.remove();
      right.remove();
      fightZone.append(div);
    }
  }
}

const app = new App()
app.componentDidMount();