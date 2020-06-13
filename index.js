const fontscan = require('fontscan')
const fontManager = require('font-manager')

const { table } = require('table')

const compare = (fd1, fd2) => {
  return (fd1.path.toLowerCase() === fd2.path.toLowerCase()? 1: 0) +
    (fd1.postscriptName === fd2.postscriptName? 1: 0) +
    (fd1.family === fd2.family? 1: 0) +
    (fd1.monospace === fd2.monospace? 1: 0) +
    (fd1.width === fd2.width? 1: 0) +
    (fd1.weight === fd2.weight? 1: 0) +
    (fd1.italic === fd2.italic? 1: 0) +
    (fd1.style === fd2.style? 1: 0)
}

const main = async () => {
  console.log('time')
  console.time('fontscan')
  let fdList1 = await fontscan.getFontList()
  console.timeEnd('fontscan')
  console.time('font-manager')
  let fdList2 = fontManager.getAvailableFontsSync()
  console.timeEnd('font-manager')

  console.log('\ncount')
  console.log('fontscan:', fdList1.length)
  console.log('font-manager:', fdList2.length)

  let sameCount = 0;
  fdList1.forEach((fd1, i) => {
    fdList2.forEach((fd2, j) => {
      if (!fd1 || !fd2) return;
      const diff = 8 - compare(fd1, fd2)
      if (diff <= 0) {
        //console.log({fd1,fd2})
        sameCount++
        fdList1[i] = null;
        fdList2[j] = null;
      }
    })
  })
  console.log('equals:', sameCount)

  const fdsort = (a, b) => {
    if (a.path.toLowerCase() < b.path.toLowerCase()) return -1
    else if (a.path.toLowerCase() > b.path.toLowerCase()) return 1
    if (a.postscriptName < b.postscriptName) return -1
    else return 1;
  }
  const fdtoStr = fd =>
    `Path: ${fd.path}\n` +
    `Family: ${fd.family}\n` +
    `Postscript name: ${fd.postscriptName}\n` +
    `Style: ${fd.style}\n` +
    `Weight: ${fd.weight}\n` +
    `Width: ${fd.width}\n` +
    `Italic: ${fd.italic}\n` +
    `Monospace: ${fd.monospace}`
  fdList1 = fdList1.filter(v => v).sort(fdsort).map(fdtoStr)
  fdList2 = fdList2.filter(v => v).sort(fdsort).map(fdtoStr)
  const diffArray = (fdList1.length > fdList2.length? fdList1: fdList2).map((_,i) => [
    fdList1[i], fdList2[i]
  ])
  diffArray.unshift(['fontscan', 'font-manager'])
  console.log('\ndiff')
  console.log(table(diffArray))
}


main()