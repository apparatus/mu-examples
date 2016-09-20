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
 * tee adapter example. Create two services and define action handlers,
 * create a consumer instance of mu and consume the action handlers. The
 * tee adapter will send calls to both services.
 */

var Mu = require('mu')
var tcp = require('mu/drivers/tcp')
var tee = require('mu/adapters/tee')



// service 1
var mu1 = Mu()

mu1.define({role: 'test', cmd: 'one'}, function (args, cb) {
  console.log('in one')
  cb()
})

mu1.define({role: 'test', cmd: 'two'}, function (args, cb) {
  console.log('SERVICE 1')
  cb(null, {my: 'response'})
})

mu1.inbound('*', tcp.server({port: 3001, host: '127.0.0.1'}))



// service 2
var mu2 = Mu()

mu2.define({role: 'test', cmd: 'one'}, function (args, cb) {
  console.log('in one')
  cb()
})

mu2.define({role: 'test', cmd: 'two'}, function (args, cb) {
  console.log('SERVICE 2')
  cb(null, {my: 'response'})
})

mu2.inbound('*', tcp.server({port: 3002, host: '127.0.0.1'}))



// consumer
var mu = Mu()

mu.outbound({role: 'test'}, tee([tcp.client({port: 3001, host: '127.0.0.1'}),
                                 tcp.client({port: 3002, host: '127.0.0.1'})]))

for (var idx = 0; idx < 10; idx++) {
  console.log('dispatching')
  mu.dispatch({role: 'test', cmd: 'two', fish: 'cheese'}, function (err, result) {
    if (err) { console.log(err) }
    console.log('done')
  })
}

