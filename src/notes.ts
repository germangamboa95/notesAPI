interface Note {
  data: string;
}

const database: Note[] = [
  {
    data: "I am the first note note",
  },
  {
    data: "I am the second note note",
  },
];

export const getNotes = (): Note[] => {
  return database;
};

export const createNote = (note: Note) => {
  database.push(note);
};
