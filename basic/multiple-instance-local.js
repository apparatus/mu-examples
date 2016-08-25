/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES LOSS OF USE, DATA, OR PROFITS OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'

/*
 * local microservice use case. Create two services each with their own mu instance and define action handlers,
 * create a consumer instance of mu and consume the action handlers using a local function transport
 */


var Mu = require('mu')
var mu1 = Mu()


// define service one

mu1.define({role: 's1', cmd: 'one'}, function (args, cb) {
  console.log('in s1 one')
  cb()
})

mu1.define({role: 's1', cmd: 'two'}, function (args, cb) {
  console.log('in s1 two')
  cb(null, {my: 'response'})
})

mu1.define('*', mu1.transports.func())


// define service two

var mu2 = Mu()

mu2.define({role: 's2', cmd: 'one'}, function (args, cb) {
  console.log('in s2 one')
  cb()
})

mu2.define({role: 's2', cmd: 'two'}, function (args, cb) {
  console.log('in s2 two')
  cb(null, {my: 'response'})
})

mu2.define('*', mu2.transports.func())


// consume services

var muc = Mu()

muc.define({role: 's1'}, muc.transports.func({target: mu1}))
muc.define({role: 's2'}, muc.transports.func({target: mu2}))

muc.dispatch({role: 's1', cmd: 'one', fish: 'cheese'}, function (err, result) {
  console.log('in cb')
  console.log(err)
  console.log(result)
  muc.dispatch({role: 's2', cmd: 'two', fish: 'cheese'}, function (err, result) {
    console.log('in cb')
    console.log(err)
    console.log(result)
  })
})

