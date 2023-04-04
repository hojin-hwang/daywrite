<template>
  <div class="about">
    <Editor @keydown="$event=>readContent(index, $event)" :id="index" v-for = "(editor, index) in paragraphEditors" :key="editor.id"></Editor>
    <article v-html="viewParagraph.body"></article>
    <textarea rows="5" input="paragraph" @input="$event=>readParagraph($event)">{{paragraph.body}}</textarea>
    <button type="button" @click="saveParagraph">SAVE</button>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { RouterLink,  useLink } from 'vue-router'
import { marked } from 'marked';
import Editor from '../components/Editor.vue';

const paragraph = reactive({
  id: 0,
  body:'',
  folder:{},
  page : 1,
});


const paragraphEditors = reactive([]);
paragraphEditors.push(paragraph)


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
  console.log(index)
  if(event.keyCode === 13)
  {
    event.preventDefault();
    const paragraph_temp = reactive({
      id: index,
      body:'',
      folder:{},
      page : 1,
    });
    paragraphEditors.splice(index+1, 0, paragraph_temp);
    //paragraphEditors.push(paragraph_temp)
  }
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
