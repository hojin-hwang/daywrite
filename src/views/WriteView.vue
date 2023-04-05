<template>
  <div class="about">
    <section>
      <div v-for="(paragraph, index) in paragraph_list" :key="index" >
        <p v-if="(paragraph.tag === 'p')" :id="'__'+index" contenteditable="true"  @keydown="$event=>readText(index, $event)" >{{ paragraph.content }}</p>
        <h1 v-else-if="(paragraph.tag === 'h1')" :id="'__'+index" contenteditable="true"  @keydown="$event=>readText(index, $event)" >{{ paragraph.content }}</h1>
      </div>
    </section>
    
    <article v-html="viewParagraph.body"></article>
    <textarea rows="5" input="paragraph" @input="$event=>readParagraph($event)">{{paragraph.body}}</textarea>
    <button type="button" @click="saveParagraph">SAVE</button>
  </div>
</template>

<script setup>
import { reactive, onMounted , nextTick} from 'vue'
import { RouterLink,  useLink } from 'vue-router'
import { marked } from 'marked';
import Editor from '../components/Editor.vue';

const paragraph_list = reactive([
  {
    tag : 'p',
    content:'kevin'
  },
])

const readText = async (index, event)=>
{
  if(event.keyCode === 13)
  {
    event.preventDefault();
  
    const new_paragraph = {
      tag : 'p',
      content: `${index}_${util.generateRandomString(6)}`
    };
    paragraph_list.splice(index+1, 0, new_paragraph);
    await nextTick();
    document.querySelector(`#__${index+1}`).focus();
  }
  else
  {
    //if(readFirstWord(event.target.innerText) === '#') changeElementTag(event.target, 'h1');
  }
}

//문장의 첫  단어가 마크테그인지 확인
const readFirstWord = (str) => 
{
  const regex = /^[^\s]+(\s[^#]+)?/;
  const match = str.match(regex);
  const result = (match)?  match[0] : 'Ops';
  return '#'
}
const changeElementTag = (target, tagName) =>
{
  console.log(target)
  // var e = document.getElementsByTagName('span')[0];

  const new_element = document.createElement(tagName);
  new_element.innerHTML = target.innerHTML;
  target.parentNode.replaceChild(new_element, target);

}


const paragraph = reactive({
  id: 0,
  body:'',
  folder:{},
  page : 1,
  focus : true,
});


const paragraphEditors = reactive([]);
paragraphEditors.push(paragraph)

// computed: {
//   paragraphEditors: function () {
//     return _.orderBy(this.users, 'name')
//   }
// }

onMounted(() => 
{
  marked.setOptions({breaks:true,gfm:true})
  const paragraphId = useLink({...RouterLink.props}).route.value.params.id;
  if(paragraphId) getParagraphAtLocalStorage(paragraphId);

})

const viewParagraph = reactive({
  body:'',
})

const readParagraph = (event)=>{
  
  viewParagraph.body = marked.parse(event.target.value);
  paragraph.body = event.target.value
}

const readContent = (index, event)=>
{
  if(event.keyCode === 13)
  {
    event.preventDefault();
    addNewEditor(index);
  }
}

const addNewEditor = async (index) => 
{
  const paragraph_temp = reactive({
      id:index+1,
      body:'',
      folder:{},
      page : 1,
  });
  paragraphEditors.splice(index+1, 0, paragraph_temp);
  console.log(paragraphEditors)
  await nextTick();
  document.querySelector(`p#_${index+1}`).focus();
}

const createNewEditor = (node) =>
{
  // const p_editor_element = document.createElement('p');
  // p_editor_element.classList.add('editor');
  // p_editor_element.setAttribute('contenteditable', true);

  //const p_editor_element = 
  //console.log(p_editor_element)
  // node.after(p_editor_element);
  // console.log(node.nextSibling.focus())
  // const new_editor_element = node.cloneNode(true);
  //node.after(Editor);
}

const setViewParagraph = (text)=>{
  viewParagraph.body = marked.parse(text);
}


const saveParagraph = ()=>
{
  const storageParagraph = {
    id:33,
    body:paragraph.body,
    date:util.getNow(),
  }
  console.log(paragraph.body);
  localStorage.setItem(storageParagraph.id, JSON.stringify(storageParagraph))
}

const getParagraphAtLocalStorage = (id) =>
{
  const localStorageData = localStorage.getItem(id);
  try
  {
    const localPargaraph = (localStorageData)? localStorageData: null;
    if(!localPargaraph) return;
    Object.assign(paragraph, JSON.parse(localPargaraph));
    setViewParagraph(paragraph.body);
  }
  catch(e)
  {
    // 
  }
  
}

const util = {
  getNow : () =>
  {
      const date = new Date();
      let year 	= date.getFullYear();
      let month 	= date.getMonth() + 1;
      let day 	= date.getDate();
      if(month < 10) {month = "0" + month};
      if(day < 10) {day = "0" + day};
      return year + "-" + month + "-" + day + " " + date.toLocaleTimeString();
  },
  removeHtmlTage : (text) => 
  {
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    return text.replace(htmlRegexG, '');
  },
  
  generateRandomString : (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

</script>
<style>

/* article{
  background-image: url('../assets/image/floral-2069810_640.png');
} */

article{
        width: 100%;
        position: relative;
}
/* article::before{
    content: "";
    background: url('../assets/image/floral-2069810_640.png');
    background-size: cover;
    opacity: 0.5;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;

    -moz-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -o-filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    -webkit-filter: grayscale(100%);
    filter: gray;
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
}
article *{
  position: relative;
} */


p.editor{width:100%; border: 1px solid #eee;}
textarea{width:100%;}
h1{margin-bottom:12px;}
p{margin-bottom:12px;}
pre{padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        color: black;
        background-color: #e0ebf6;
        border-radius: 6px;
}
blockquote{
  margin: 16px;
  padding: 0 1em;
  /* color: black; */
  border-left: 0.25em solid #d0d7de;
}  
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
