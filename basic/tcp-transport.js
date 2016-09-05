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
 * tcp microservice example. Create a service and define action handlers,
 * create a consumer instance of mu and consume the action handlers using a local function transport
 */

var Mu = require('mu')
var tcp = require('mu/drivers/tcp')



// define service
var mus = Mu()

mus.define({role: 'test', cmd: 'one'}, function (args, cb) {
  mus.log.info('in one')
  cb()
})

mus.define({role: 'test', cmd: 'two'}, function (args, cb) {
  mus.log.info('in two')
  cb(null, {my: 'response'})
})

mus.inbound('*', tcp.server({port: 3001, host: '127.0.0.1'}))



// consume service
var muc = Mu()

muc.outbound('*', tcp.client({port: 3001, host: '127.0.0.1'}))

muc.dispatch({role: 'test', cmd: 'one', fish: 'cheese'}, function (err, result) {
  muc.log.debug(err)
  muc.log.info('in cb ONE')
  muc.dispatch({role: 'test', cmd: 'two', fish: 'cheese'}, function (err, result) {
    muc.log.debug(err)
    muc.log.info('in cb TWO')
    muc.tearDown()
    mus.tearDown()
  })
})

