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
 * balance adapter example. Create two services and define action handlers,
 * create a consumer instance of mu and consume the action handlers using a round robin
 * balancer across the two service instances over tcp transport
 */

var Mu = require('mu')


// service 1

var mu1 = Mu().use('tcp')

mu1.define({role: 'test', cmd: 'one'}, function (args, cb) {

  console.log('in one')
  cb()

})

mu1.define({role: 'test', cmd: 'two'}, function (args, cb) {
  console.log('SERVICE 1')
  cb(null, {my: 'response'})
})

mu1.inbound('*', mu1.transports.tcp({source: {port: 3001, host: '127.0.0.1'}}))


// service 2

var mu2 = Mu().use('tcp')

mu2.define({role: 'test', cmd: 'one'}, function (args, cb) {
  console.log('in one')
  cb()
})

mu2.define({role: 'test', cmd: 'two'}, function (args, cb) {
  console.log('SERVICE 2')
  cb(null, {my: 'response'})
})

mu2.inbound('*', mu2.transports.tcp({source: {port: 3002, host: '127.0.0.1'}}))


// consumer

var mu = Mu().use('tcp').use('balance')

mu.outbound({role: 'test'}, mu.transports.balance([mu.transports.tcp({target: {port: 3001, host: '127.0.0.1'}}),
                                                 mu.transports.tcp({target: {port: 3002, host: '127.0.0.1'}})]))

for (var idx = 0; idx < 10; idx++) {
  console.log('dispatching')
  mu.dispatch({role: 'test', cmd: 'two', fish: 'cheese'}, function (err, result) {
    if (err) { console.log(err) }
    console.log('done')
  })
}

