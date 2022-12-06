/**
 * Created by Peter Ryszkiewicz (https://github.com/pRizz) on 2017/10/01
 * https://github.com/pRizz/Simple-Hash-Generator
 */

const app = angular.module("generatedHashList", [])

// https://en.wikipedia.org/wiki/Orders_of_magnitude_(data)
// [1000^value, prefix]
const byteFormatterList = [
    [8, 'Y'],
    [7, 'Z'],
    [6, 'E'],
    [5, 'P'],
    [4, 'T'],
    [3, 'G'],
    [2, 'M'],
    [1, 'k'],
].map((byteArgs) => {
    return {
        minValue: Math.pow(1000, byteArgs[0]),
        prefix: byteArgs[1]
    }
})

// https://en.wikipedia.org/wiki/Orders_of_magnitude_(data)
// converts the input (number of bytes) to a human readable number, like 500 bytes or 3.5 MB
function formatBytes(numberOfBytes) {
    for(const byteFormat of byteFormatterList) {
        if(numberOfBytes >= byteFormat.minValue) {
            return `${(numberOfBytes / byteFormat.minValue).toLocaleString(undefined, {
                maximumFractionDigits: 3
            })} ${byteFormat.prefix}B`
        }
    }
    return `${numberOfBytes} bytes`
}

// from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
function hashToHex(buffer) {
    const hexCodes = []
    const view = new DataView(buffer)

    for(let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i)
        const stringValue = value.toString(16)
        const padding = '00000000'
        const paddedValue = (padding + stringValue).slice(-padding.length)
        hexCodes.push(paddedValue)
    }

    return hexCodes.join('')
}

// from https://jsperf.com/utf-8-byte-length
// returns the byte length of a utf8 string
function byteLength(str) {
    let s = str.length
    for (let i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i)
        if (code > 0x7f && code <= 0x7ff) s++
        else if (code > 0x7ff && code <= 0xffff) s+=2
    }
    return s;
}

function createGeneratedHashRows() {
    return [
        {
            name: 'SHA-1',
            hash: '',
            generationDurationText: '',
            hashFunction: function(buffer) {
                return crypto.subtle.digest('SHA-1', buffer).then(hash => {
                    return hashToHex(hash)
                })
            }
        },
        {
            name: 'SHA-256',
            hash: '',
            generationDurationText: '',
            hashFunction: function(buffer) {
                return crypto.subtle.digest('SHA-256', buffer).then(hash => {
                    return hashToHex(hash)
                })
            }
        },
        {
            name: 'SHA-384',
            hash: '',
            generationDurationText: '',
            hashFunction: function(buffer) {
                return crypto.subtle.digest('SHA-384', buffer).then(hash => {
                    return hashToHex(hash)
                })
            }
        },
        {
            name: 'SHA-512',
            hash: '',
            generationDurationText: '',
            hashFunction: function(buffer) {
                return crypto.subtle.digest('SHA-512', buffer).then(hash => {
                    return hashToHex(hash)
                })
            }
        },
        {
            name: 'blake2b',
            hash: '',
            generationDurationText: '',
            hashFunction: function(buffer) {
                return new Promise((resolve) => {
                    const blake2b512Bit = window.blake2b(64) // 64 bytes * 8 bits/byte = 512 bits
                    blake2b512Bit.update(buffer)
                    resolve(blake2b512Bit.digest('hex'))
                })
            }
        },
    ]
}

let fileChangedCallback = null

function fileToBytesPromise(file) {
    return new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = function(e) {
            resolve(e.target.result)
        }
        fileReader.readAsArrayBuffer(file)
    })
}

app.controller("generatedHashListController", $scope => {
    $scope.generatedHashRows = createGeneratedHashRows()
    $scope.inputToHash = ''
    $scope.inputSize = ''
    $scope.fileInputSize = ''

    function generateHashesWithString(string) {
        const buffer = new TextEncoder('utf-8').encode(string)
        generateHashesWithBuffer(buffer)
    }

    function generateHashesWithBuffer(buffer) {
        $scope.generatedHashRows.forEach(generatedHashRow => {
            const hashStartDate = performance.now()
            generatedHashRow.hashFunction(buffer).then(hashedValue => {
                generatedHashRow.hash = hashedValue
                const hashEndDate = performance.now()
                const hashDuration = hashEndDate - hashStartDate
                const hashDurationText = hashDuration.toLocaleString(undefined, {
                    maximumFractionDigits: 3
                })
                const nsPerByte = hashDuration / buffer.length * 1000000
                const nsPerByteText = nsPerByte.toLocaleString(undefined, {
                    maximumFractionDigits: 3
                })
                generatedHashRow.generationDurationText = `Took ${hashDurationText} ms; ${nsPerByteText} ns/byte`
                $scope.$apply()
            })
        })
    }

    $scope.$watch('inputToHash', newValue => {
        const numberOfBytesInInput = byteLength(newValue)
        $scope.inputSize = `${formatBytes(numberOfBytesInInput)}`
        generateHashesWithString(newValue)
    })

    fileChangedCallback = file => {
        $scope.fileInputSize = `${formatBytes(file.size)}`
        fileToBytesPromise(file).then(fileBytes => {
            generateHashesWithBuffer(new Uint8Array(fileBytes))
        })
    }
})

$(() => {
    const $fileToHashForm = $("#fileToHashForm")

    $fileToHashForm.on('drop', function(e) {
        const droppedFiles = e.originalEvent.dataTransfer.files
        fileChangedCallback(droppedFiles[0])
    })
})
