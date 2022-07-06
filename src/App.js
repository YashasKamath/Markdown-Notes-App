import React, { useEffect } from "react"
import Sidebar from "./Components/Sidebar"
import Editor from "./Components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import './App.css';

export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem('notes')) || []
  )
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  )
  
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }
  
  function updateNote(text) {
    // repositioning the current note to the top
    setNotes(oldNotes => {
      let newNotes=[]
      for(let i=0;i<oldNotes.length;i++){
        if(currentNoteId===oldNotes[i].id){
          oldNotes[i].body=text
          newNotes.splice(0,0,oldNotes[i])
        }
        else newNotes.push(oldNotes[i])
      }
      return newNotes
    })
    //Not repositioning current notes to the top
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //   return oldNote.id === currentNoteId
    //     ? { ...oldNote, body: text }
    //     : oldNote
    // }))
  }
  
  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }
  
  //deleting function functionality
  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => 
      oldNotes.filter(item=>item.id!==noteId)
    )
  }

  //saving data to local storage to preserve it when page refreshes
  useEffect(()=>{
    localStorage.setItem('notes',JSON.stringify(notes))
  },[notes])

  return (
    <main>
    {
      notes.length > 0 
      ?
      <Split 
        sizes={[30, 70]} 
        direction="horizontal" 
        className="split"
      >
      <Sidebar
        notes={notes}
        currentNote={findCurrentNote()}
        setCurrentNoteId={setCurrentNoteId}
        newNote={createNewNote}
        deleteNote={deleteNote}
      />
      {
        currentNoteId && 
        notes.length > 0 &&
        <Editor 
          currentNote={findCurrentNote()} 
          updateNote={updateNote} 
        />
      }
      </Split>
      :
      <div className="no-notes">
        <h1>You have no notes</h1>
        <button 
          className="first-note" 
          onClick={createNewNote}
        >
          Create one now
        </button>
      </div>
    }
    </main>
  )
}

