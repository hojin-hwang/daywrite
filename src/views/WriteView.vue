<template>
  <div class="about">
    <article v-html="viewParagraph.body"></article>
    <textarea rows="5" input="paragraph" @input="$event=>readParagraph($event)">{{paragraph.body}}</textarea>
    <button type="button" @click="saveParagraph">SAVE</button>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { RouterLink,  useLink } from 'vue-router'

const paragraph = reactive({
  body:'',
  folder:{},
  page : 1,
});

onMounted(() => {
  const paragraphId = useLink({...RouterLink.props}).route.value.params.id;
  if(paragraphId) getParagraphAtLocalStorage(paragraphId);
})


const viewParagraph = reactive({
  body:'',
})

const readParagraph = (event)=>{
  marked.marked.setOptions({break:true,gfm:true})
  viewParagraph.body = marked.parse(event.target.value);
  paragraph.body = event.target.value
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
    //paragraph.body = util.removeHtmlTage(paragraph.body);
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
textarea{width:100%;}
h1{margin-bottom:12px;}

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
