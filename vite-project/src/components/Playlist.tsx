import { useState } from "react"
import React from "react";
import Editor from "./PlaylistEditor";

interface Playlist{
  id: string,
  title: string,
  description: string
}


interface PlaylistProps {
  id: string,
  title: string,
  description: string,
  edit: boolean,
  myPlaylists: Array<Playlist>,
  setMyPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>,
  setEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setDescription: React.Dispatch<React.SetStateAction<string>>
}

const Playlist : React.FC<PlaylistProps> = ({myPlaylists, id ,title, description, edit, setEdit,  setTitle, setDescription, setMyPlaylists}) => {

  console.log(myPlaylists, title, description, edit , setEdit, setTitle, setDescription)

  const [showModal, setShowModal] = useState(false);

  function savePlaylist(){
    console.log(`saving playlist with id: ${id} title: ${title}, and description: ${description}`)
    setMyPlaylists([...myPlaylists, {
      id: id,
      title: title,
      description: description
    }])
  }

  function titleInput(e: React.ChangeEvent<HTMLInputElement>){
    setTitle(e.target.value)
  }
  function descriptionInput(e: React.ChangeEvent<HTMLTextAreaElement>){
    setDescription(e.target.value)
  }

  return (
    <div>
      <br />
      <form>
      <div className="relative z-0 w-full mb-6 group">
        <input onChange={titleInput} className="text-xl block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
        <label className="text-xl peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Title</label>
        <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter a title for you playlist!</p>

        <br />
        <textarea onChange={descriptionInput} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Something sad that will make me think of a life long gone, but not forgotten.."></textarea>
        <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter a description!</p>

      </div>
    </form>
      <button onClick={savePlaylist} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">save</button>

      <>
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={() => setShowModal(true)}
        >
          view/add songs
        </button>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
\                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                  <div className="relative p-6 flex-auto">
                    <Editor />
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      onClick={savePlaylist}
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>


    </div>
  )

}

export default Playlist