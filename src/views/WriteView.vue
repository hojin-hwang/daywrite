<template>
  <div class="wirte-view">
    <section>
      <div v-for="(paragraph, index) of paragraph_list" :key="index" >
        <p v-if="(paragraph.tag === 'p')" :id="'__'+index" contenteditable="true" @keyup="setContent(index, $event)" @keydown="$event=>readText(index, $event)" class="editor" :placeholder="paragraph.placeholder">{{ paragraph.content }}</p>
        <h1 v-else-if="(paragraph.tag === 'h1')" :id="'__'+index" contenteditable="true"  @keyup="setContent(index, $event)" @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</h1>
        <blockquote v-else-if="(paragraph.tag === 'blockquote')" :id="'__'+index" contenteditable="true" @keyup="setContent(index, $event)" @keydown="$event=>readText(index, $event)" class="editor">{{ paragraph.content }}</blockquote>
      </div>
    </section>
    <footer>
      <button type="button" @click="deleteParagraph" class="action delete">DEL</button>
      <button type="button" @click="saveParagraph" class="action save">SAVE</button>
    </footer>
    <div class="test"></div>
  </div>
</template>

<script setup>
import { reactive, onMounted , nextTick, onUpdated} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article.js'

// import { marked } from 'marked'

const router = useRouter();
const index = (useRoute().params.id)? useRoute().params.id: null;
const store = useArticleStore();

console.log(store.completeDayWrite);

const paragraph_list = reactive([]);
const new_paragraph = {tag : 'p',content:'', placeholder:"제목은 '# ', 인용문은 '> '으로 시작해주세요"};
const blank_line = {tag : 'p',content:'', placeholder:""};
let is_new_article = true;
let create_date;

onMounted(()=>{
  
});

if(store.localData[index])
{
    is_new_article = false;
    const temp_paragraph_array = `${store.localData[index].article}`.split('\r\n\r');
    create_date = store.localData[index].createDate;
    
    temp_paragraph_array.pop(); // Remove last element 
    (temp_paragraph_array).forEach((paragraph) =>
    {
      paragraph = paragraph.replaceAll('&nbsp;' , '');
      paragraph = paragraph.replace('\n' , '');
      paragraph = paragraph.replace('\n\r' , '');
      paragraph = paragraph.replace('\n\r\n' , '');

      if(paragraph.substring(0,1) === '#')
      {
        paragraph_list.push({tag : 'h1',content:paragraph.substring(1)});
      }
      else if(paragraph.substring(0,1) === '>')
      {
        paragraph_list.push({tag : 'blockquote',content:paragraph.substring(1)});
      }
      else
      {
        paragraph_list.push({tag : 'p',content:paragraph});
      }
    });
    console.log(store.localData[index].article.replaceAll('test','--'));
    console.log(store._localData[index].article)
    console.log(temp_paragraph_array)
}
else //신규다
{
  paragraph_list.push(new_paragraph);
  paragraph_list.push(blank_line);
}

const readText = async (index, event)=>
{
  if(event.keyCode === 13) //enter
  {
    const selection = window.getSelection();
    event.preventDefault();
    const after_content = paragraph_list[index].content.substring(selection.focusOffset);
    paragraph_list[index].content = paragraph_list[index].content.substring(0,selection.focusOffset)
    const new_paragraph = {
      tag : 'p',
      content: after_content,
    };
    paragraph_list.splice(index+1, 0, new_paragraph);
    await nextTick();
    const next_editor = document.querySelector(`#__${index+1}`);
    next_editor.focus();
    
    // const range = document.createRange(); 
    // range.selectNodeContents(next_editor); 
    // range.collapse(false); 
    // const after_selection = window.getSelection();
    // after_selection.removeAllRanges(); //remove any selections already made
    // after_selection.addRange(range); 

  }
  else if(event.keyCode === 8)//Delete return p tag by pressing delete key at first position 
  {
    if(window.getSelection().anchorOffset === 0)
    {
      const check_text = paragraph_list[index].content.replace(/\s/g, "");
      if(check_text.length === 0 && index > 0)
      {
        //현재 행 지우기
        paragraph_list.splice(index, 1);
        await nextTick();
        document.querySelector(`#__${index-1}`).focus();
        return;
      }

      paragraph_list[index].tag = 'p';
      await nextTick();
      document.querySelector(`#__${index}`).focus();
    }
  }
  else if(event.keyCode === 40)
  {
    document.querySelector(`#__${index+1}`)?.focus();
  }
  else if(event.keyCode === 38)
  {
    document.querySelector(`#__${index-1}`)?.focus();
  }
  else //normal
  {
    const current_tag_name = event.target.tagName.toLowerCase();
    const tag_name = readFirstWord(event.target.innerText.substring(0,10), current_tag_name);
    if(tag_name !== current_tag_name)
    {
      paragraph_list[index].tag = tag_name;
      paragraph_list[index].content = event.target.innerText.substring(1) + '\n';
      await nextTick();
      document.querySelector(`#__${index}`).focus();
    }
  }
}

const setContent = async (index, event)=> paragraph_list[index].content = event.target.innerText;

//문장의 첫  단어가 마크테그인지 확인
const readFirstWord = (str, current_tag_name) => 
{
  const first_word = str.substring(0,1);
  if(first_word === '#') return 'h1';
  else if(first_word === '>') return 'blockquote';
  else return current_tag_name;
}

onMounted(() => 
{
  document.querySelectorAll('.editor:last-child').forEach(editor => editor.focus());
})

const saveParagraph = ()=>
{
  let text = '';
  paragraph_list.forEach(paragraph=>{
    if(paragraph.tag === 'p')
    {
      text += `${paragraph.content}&nbsp;\n\n`;
    }
    else if(paragraph.tag === 'blockquote')
    {
      text += `> ${paragraph.content}\n\n`;
    }
    else if(paragraph.tag === 'h1')
    {
      text += `# ${paragraph.content}\n\n`;
    }
  })

  const article_data = {  article : text, }

  article_data.archiveNo = (is_new_article)? Date.now().toString() : store.localData[index].archiveNo;
  article_data.createDate = (create_date)? create_date : util.getNow();
  
  localStorage.setItem(article_data.archiveNo, JSON.stringify(article_data));
  
  if(is_new_article) 
  {
    store.addArticle(article_data) ;
    router.push({name: 'readContent' });
  }
  else 
  {
    store.updateArticle(article_data, index) ;
    router.push({name: 'readContentById', params:{no:index} });
  }
  
}

const deleteParagraph = ()=>
{
  if(store.localData[index].archiveNo && localStorage.getItem(store.localData[index].archiveNo)) 
  {
    localStorage.removeItem(store.localData[index].archiveNo);
    store.deleteArticle(index, store.localData[index]);
  }
  router.push({name: 'readContentById', params:{no:index}});
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
.wirte-view{
  padding-top: 12px;
}
article{
  width: 100%;
  position: relative;
}

.editor{width:100%; outline: none;}
.editor:focus{border-bottom: 1px solid #eee; }

[contenteditable=true]:empty:before

{
  content: attr(placeholder);
  /* display: block; For Firefox */
}

h1{margin-bottom:12px;font-size:24px!important;}

pre{padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    color: black;
    background-color: #e0ebf6;
    border-radius: 6px;
}

blockquote{
  display: block;
  margin: 16px;
  padding: 0 1em;
  border-left: 0.25em solid #d0d7de;
} 

footer
{
  padding-top: 48px;
  display: flex;
  justify-content: space-between;
}

button.action{
  transition: 0.4s;
  justify-content: flex-end;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  padding: 12px;
}
button.save{ color: hsla(160, 100%, 37%, 1);}
button.save:hover{background-color: hsla(160, 100%, 37%, 0.2);}
button.delete{ color: rgb(189, 63, 0);}
button.delete:hover{background-color: hsla(33, 100%, 37%, 0.2);}


@media (min-width: 1024px) {
  footer{
    min-width: 50vw;
  }
}
</style>
