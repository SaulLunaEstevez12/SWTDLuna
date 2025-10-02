// app.js - Manejo de DOM + localStorage
const $ = (s, c=document)=>c.querySelector(s);
const $$ = (s, c=document)=>Array.from(c.querySelectorAll(s));
const KEY = 'todos-awp-v1';

function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch{ return []; } }
function save(todos){ localStorage.setItem(KEY, JSON.stringify(todos)); }

function uuid(){ return 't_'+Math.random().toString(36).slice(2,9); }

function render(){
  const list = $('#todo-list');
  const todos = load();
  list.innerHTML = '';
  if(!todos.length){
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = '<span class="title" style="opacity:.7">Aún no hay tareas</span>';
    list.appendChild(li);
    return;
  }
  for(const t of todos){
    const li = document.createElement('li');
    li.className = 'todo-item'+(t.done?' done':'');
    const chk = document.createElement('input'); chk.type='checkbox'; chk.checked = t.done;
    const title = document.createElement('input'); title.className='title'; title.value=t.title;
    const del = document.createElement('button'); del.className='icon-btn'; del.textContent='🗑';
    li.append(chk, title, del);
    chk.addEventListener('change', ()=>{ t.done = chk.checked; save(todos); render(); });
    title.addEventListener('change', ()=>{ t.title = title.value.trim(); save(todos); render(); });
    del.addEventListener('click', ()=>{ const i=todos.findIndex(x=>x.id===t.id); if(i>-1){ todos.splice(i,1); save(todos); render(); } });
    list.appendChild(li);
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  $('#todo-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const input = $('#todo-input');
    const title = input.value.trim();
    if(!title) return;
    const todos = load();
    todos.unshift({ id: uuid(), title, done:false, createdAt: Date.now() });
    save(todos);
    input.value='';
    render();
  });
  render();
});
