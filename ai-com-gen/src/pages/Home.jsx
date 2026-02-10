import React from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from "react-icons/hi";
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { IoCloseSharp } from "react-icons/io5";


const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  //  The client gets the API key from the environment variable `GEMINI_API_KEY`.
 
  const ai = new GoogleGenAI({
   apiKey: import.meta.env.VITE_GEMINI_API_KEY
 });


  async function getResponse() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
    `,
    });
    console.log(response.text);
    setCode(extractCode(response.text));
    setOutputScreen(true);
    setLoading(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("code copied to clipboard")
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };
  return (
    <>
      <Navbar />

      <div className="flex items-center px-[100px] justify-between gap-[30px ]">
        <div className="left w-[49%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
          <p className='text-gray-400 mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
                boxShadow: "none",
                "&:hover": { borderColor: "#555" }
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                color: "#fff"
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                    ? "#222"
                    : "#111",
                color: "#fff",
                "&:active": { backgroundColor: "#444" }
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              input: (base) => ({ ...base, color: "#fff" })
            }}
            onChange={(e) => {
              setFrameWork(e.value)
            }}

          />
          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea onChange={(e) => { setPrompt(e.target.value) }} value={prompt} className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-[10px] ' placeholder="Describe your component in detail and let Ai  will code  for your component. "></textarea>
          <div className="flex items-center justify-between ">
            <p className='text-gray-400 text-sm'>Click on generate button to get your code</p>
            <button  onClick={getResponse} className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400  to-purple-600 mt-3 px-[20px]  gap-[10px] transition-al hover:opacity-[.8]">
              {
                loading == false ?
                  <>
                    <i><BsStars /></i>
                  </> : ""
              }

              {
                loading === true ?
                  <>
                    <ClipLoader color='white' size={20} />
                  </> : ""
              }
              Generate </button>

          </div>
        </div>
        <div className="right relative mt-2 left w-[49%] h-[80vh] bg-[#141319] rounded-xl ">
          {
            outputScreen == false ?
              <>
                <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                  <div className="circle p-[20px] w-[70px] flex item-center justify-center text-[30px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400  to-purple-600"><HiOutlineCode /></div>
                  <p className="text-[16px] text-[gray] mt-3" >Your component & code will appear here.</p>
                </div>
              </> : <>
                <div className="top w-full h-[60px] bg-[#17171C] flex items-center gap-[15px] px-[20px]">

                  <button onClick={() => { setTab(1) }} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab == 1 ? "bg-[#333]" : ""}`}>Code</button>
                  <button onClick={() => { setTab(2) }} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab == 2 ? "bg-[#333]" : ""}`}>Preview</button>

                </div>
                <div className="top-2 top w-full h-[60px] bg-[#17171C] flex items-center justify-between gap-[15px] px-[20px]">
                  <div className="left">
                    <p className='font-bold'>Code Editor</p>
                  </div>

                  <div className="right flex items-center gap-[10px]">
                    {
                      tab === 1 ?
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-kl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                          <button className="export copy w-[40px] h-[40px] rounded-kl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><PiExportBold /></button>
                        </>
                        :
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-kl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => { setIsNewTabOpen(true) }}><ImNewTab /></button>
                          <button className="export copy w-[40px] h-[40px] rounded-kl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCcw /></button>
                        </>
                    }

                  </div>

                </div>
                <div className="editor h-full ">
                  {
                    tab === 1 ?
                      <>
                        <Editor value={code} height="100%" theme='vs-dark' language="html" />
                      </> :
                      <>
                        <iframe srcDoc={code} className="preview w-full h-full bg-white text-black flex items-center justify-center">
                        </iframe>
                      </>

                  }

                </div>
              </>
          }
        </div>
      </div>

      {
        isNewTabOpen === true ?
          <>
        <div className='container absolute left-0 top-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto'>
          <div className='top text-black w-full h-[60px] flex items-center justify-between px-[20px]'>
            <div className='left'>
              <p className='font-bold'>Preview</p>           
            </div>
             <div className='right flex items-center gap-[10px]'>
              <button className='copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]' onClick ={() =>{setIsNewTabOpen(false)}}><IoCloseSharp /></button>
             </div>
          </div>

            <iframe srcDoc={code } className="w-full h-full"></iframe>
        </div>
          </>
          : ""
      }
    </>
  )
}

export default Home

