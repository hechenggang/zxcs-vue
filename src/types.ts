// 定义数据类型

type typeBook = [string, string, string, string]
type typeBooks = Array<typeBook>
type typeChapter = [ string, number, number]
type typeChapters = Array<typeChapter>
type typeHistory = [string, string, string, string]

export type { typeHistory, typeBook, typeBooks, typeChapter, typeChapters }
