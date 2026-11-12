(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem('cc-'+k))??d}catch{return d}},set(k,v){try{localStorage.setItem('cc-'+k,JSON.stringify(v))}catch{}}};
const catalog=[
['Курсы','Frontend-разработчик','Современная вёрстка, JavaScript и React','courses.html'],
['Курсы','Backend-разработчик','Серверная разработка и API','courses.html'],
['Курсы','Fullstack-разработчик','Frontend и backend в одном направлении','courses.html'],
['Курсы','Python-разработчик','Python, автоматизация и основы разработки','courses.html'],
['Преподаватели','Алексей Смирнов','Backend-разработчик','teachers.html'],
['Преподаватели','Мария Иванова','Frontend-разработчик','teachers.html'],
['Преподаватели','Дмитрий Козлов','DevOps-инженер','teachers.html'],
['Преподаватели','Елена Петрова','UI/UX-дизайнер','teachers.html'],
['Преподаватели','Максим Орлов','Fullstack-разработчик','teachers.html'],
['Преподаватели','Анна Соколова','Data Scientist','teachers.html'],
['Преподаватели','Кирилл Волков','Python-разработчик','teachers.html'],
['Преподаватели','София Лебедева','Frontend-разработчик','teachers.html'],
['Журнал','Как устроен современный JavaScript','Практическое руководство','blog.html'],
['Журнал','Путь frontend-разработчика','Навыки и инструменты','blog.html'],
['Журнал','Основы проектирования API','Backend и архитектура','blog.html'],
['Журнал','Как подготовиться к техническому интервью','Карьера в IT','blog.html']
];
const modal=(id,title,body)=>{let el=document.getElementById(id);if(!el){el=document.createElement('div');el.id=id;el.className='cc-modal-backdrop';el.innerHTML=`<section class="site-modal" role="dialog" aria-modal="true" aria-label="${title}"><button class="cc-close" aria-label="Закрыть" style="float:right;border:0;background:transparent;font-size:24px;cursor:pointer;color:inherit">×</button><h2>${title}</h2><div class="cc-modal-body">${body}</div></section>`;document.body.append(el);el.addEventListener('click',e=>{if(e.target===el||e.target.closest('.cc-close'))el.classList.remove('is-open')});}return el};
const open=(el)=>el.classList.add('is-open');
const searchBody=`<label class="cc-field"><span>Поиск по курсам, преподавателям и журналу</span><input class="cc-search-input" type="search" placeholder="Например, JavaScript или Мария Иванова" autofocus></label><div class="cc-results" aria-live="polite"></div>`;
const search=modal('cc-search','Поиск по CodeCraft',searchBody);
const searchInput=$('.cc-search-input',search), results=$('.cc-results',search);
function renderSearch(q=''){const words=q.trim().toLocaleLowerCase('ru').split(/\s+/).filter(Boolean);const found=catalog.filter(x=>words.every(w=>x.join(' ').toLocaleLowerCase('ru').includes(w)));results.innerHTML=found.length?found.map(x=>`<a class="cc-result" href="${x[3]}"><strong>${x[1]}</strong><small>${x[0]} · ${x[2]}</small></a>`).join(''):'<div class="cc-empty">Ничего не найдено. Попробуйте другой запрос.</div>'}
searchInput.addEventListener('input',()=>renderSearch(searchInput.value));renderSearch();
$$('.site-search-toggle').forEach(b=>b.addEventListener('click',()=>{open(search);searchInput.focus()}));
const profile=modal('cc-profile','Личный кабинет',`<p>Демонстрационный профиль ученика. Данные сохраняются только в этом браузере.</p><form id="cc-profile-form"><label class="cc-field">Имя<input name="name" required placeholder="Ваше имя"></label><label class="cc-field">Email<input name="email" type="email" placeholder="name@example.com"></label><label class="cc-field">Моя цель<textarea name="goal" rows="3" placeholder="Например, освоить frontend-разработку"></textarea></label><div class="cc-modal-actions"><button class="cc-btn" type="submit">Сохранить профиль</button><button class="cc-btn secondary" type="button" id="cc-profile-clear">Очистить</button></div></form><div id="cc-profile-status" aria-live="polite"></div><p><small>Это демонстрация: регистрации, сервера и передачи данных нет.</small></p>`);
const form=$('#cc-profile-form',profile), saved=store.get('profile',{});
['name','email','goal'].forEach(k=>{if(form.elements[k])form.elements[k].value=saved[k]||''});
form.addEventListener('submit',e=>{e.preventDefault();store.set('profile',Object.fromEntries(new FormData(form)));$('#cc-profile-status',profile).textContent='Профиль сохранён на этом устройстве.'});
$('#cc-profile-clear',profile).addEventListener('click',()=>{form.reset();store.set('profile',{});$('#cc-profile-status',profile).textContent='Локальный профиль очищен.'});
$$('.account-toggle').forEach(b=>b.addEventListener('click',()=>open(profile)));
const fav=modal('cc-favorites','Избранное','<div class="cc-results"></div>');
function favItems(){return store.get('favorites',[])}
function refreshFav(){const box=$('.cc-results',fav),items=favItems();box.innerHTML=items.length?items.map((x,i)=>`<div class="cc-result"><strong>${x.title}</strong><small>${x.type}</small><button class="cc-btn secondary" data-remove="${i}" style="margin-top:8px">Убрать</button></div>`).join(''):'<div class="cc-empty">Пока ничего не добавлено. Нажмите ♡ на карточке курса или статьи.</div>';$$('[data-remove]',box).forEach(b=>b.addEventListener('click',()=>{const a=favItems();a.splice(+b.dataset.remove,1);store.set('favorites',a);refreshFav();syncFav()}))}
function syncFav(){const items=favItems();$$('[data-cc-fav]').forEach(b=>{const on=items.some(x=>x.key===b.dataset.ccFav);b.setAttribute('aria-pressed',String(on));b.textContent=on?'♥':'♡'})}
$$('.favorites-toggle').forEach(b=>b.addEventListener('click',()=>{refreshFav();open(fav)}));
function addFav(card,type){const title=$('h3,h2',card)?.textContent?.trim()||card.textContent.trim().slice(0,70);const key=type+'|'+title;let a=favItems();if(a.some(x=>x.key===key))a=a.filter(x=>x.key!==key);else a.push({key,title,type});store.set('favorites',a);syncFav();refreshFav()}
$$('.course-card,.article-card,.teacher-card').forEach((card,i)=>{const type=card.matches('.course-card')?'Курс':card.matches('.teacher-card')?'Преподаватель':'Статья';const title=$('h3,h2',card)?.textContent?.trim()||type+' '+(i+1);const key=type+'|'+title;const b=document.createElement('button');b.className='favorite-action';b.type='button';b.dataset.ccFav=key;b.title='Добавить в избранное';b.setAttribute('aria-label','Добавить в избранное');b.addEventListener('click',()=>addFav(card,type));card.append(b)});
syncFav();
$$('.course-card,.teacher-card,.article-card,.feature-card,.step-card').forEach((el,i)=>{el.style.animationDelay=(i%6)*55+'ms';el.classList.add('cc-animate-in')});
$$('button,.button').forEach(b=>b.addEventListener('click',()=>{b.classList.remove('cc-ripple');void b.offsetWidth;b.classList.add('cc-ripple')}));
$$('.course-card,.teacher-card,.article-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*2.2}deg) rotateY(${x*2.2}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
})();
