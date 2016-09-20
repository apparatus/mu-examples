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
var tcp = require('mu/drivers/tcp')



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


// custom adapter - console logs the packet and forwards
var customAdapter = function (transports) {
  var muid = 'bob-123'

  function tf (message, cb) {
    console.log('MESSAGE: ', message)
    for (var index = 0; index < transports.length; ++index) {
      transports[index].tf(message, cb)
    }
  }

  function setMu (muInstance) {
    transports.forEach(function (transport) {
      transport.setMu(muInstance)
    })
  }

  function setId (id) {
    transports.forEach(function (transport) {
      transport.setId(muid)
    })
  }


  setId(muid)
  return {
    muid: muid,
    tf: tf,
    type: 'transport',
    setId: setId,
    setMu: setMu
  }
}



// consumer
var mu = Mu()
mu.outbound({role: 'test'}, customAdapter([tcp.client({port: 3001, host: '127.0.0.1'})]))

for (var idx = 0; idx < 10; idx++) {
  console.log('dispatching')
  mu.dispatch({role: 'test', cmd: 'two', fish: 'cheese'}, function (err, result) {
    if (err) { console.log(err) }
    console.log('done')
  })
}

