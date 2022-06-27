

type Book = {
  book_author: string,
  book_brief: string,
  book_id: number,
  book_name: string,
}
type Books = Array<Book>
type Chapter = [number, string]
type Chapters = Array<Chapter>
type History = Record<string,[number,string]>

export type { History, Book, Books, Chapter, Chapters }
