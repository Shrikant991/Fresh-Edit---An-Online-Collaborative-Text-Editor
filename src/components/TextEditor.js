import { useCallback, useEffect, useState } from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import io from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import logo from '../images/Fresh-Edit-Logo.png'

const HEROKU_ADD = 'https://fresh-edit-server.herokuapp.com/';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id: documentId } = useParams();
  const [show, setShow] = useState(false);

  // setting up the editor
  const WrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
      history: {
        delay: 2000,
        userOnly: true,
      },
    });
    q.disable();
    q.setText('Loading....');
    setQuill(q);
  }, []);

  // Setting up the connection to server
  useEffect(() => {
    const s = io(HEROKU_ADD);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // capturing the changes and sending it to the server
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };
    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  // update content with the changes made
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit('save-doc', quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once('load-document', (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);

  // div having the editor
  return (
    <div>
      <Toast onClose={() => setShow(false)} show={show} delay={1500} style={{
        position: 'absolute',
        top: 0,
        right: 0,
        "margin-top": "50px"
      }} autohide>
        <Toast.Header>
          <img
            src={logo}
            className="rounded mr-2"
            alt=""
            style={{ height: '100%', width: "2rem" }}
          />
          <strong className="mr-auto">Fresh Edit</strong>
          <small>1 sec ago</small>
        </Toast.Header>
        <Toast.Body>Document ID Copied to Clipboard</Toast.Body>
      </Toast>
      <Button variant="danger" onClick={() => {
        setShow(true)
        navigator.clipboard.writeText(documentId)
      }} style={{ "position": "absolute", "right": 0, "margin-right": "20px" }}>
        Copy Document ID
      </Button>
      <Link to="/" className="btn btn-danger" style={{ "position": "absolute", "margin-left": "110px" }}>Home</Link>
      <div className="container" ref={WrapperRef}></div>
    </div>
  );
};

export default TextEditor;
