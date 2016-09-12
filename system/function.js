/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'

var func = require('mu/drivers/func')


/*
 * spin up service and consume them in process using function transport
 */

function init (cb) {
  require('./system/service1/service')(function (s1) {
    s1.inbound('*', func())
    require('./system/service2/service')(function (s2) {
      s2.inbound('*', func())
      require('./system/service3/service')(function (s3) {
        s3.inbound('*', func())
        s3.outbound({role: 's1'}, func({target: s1}))
        cb(s1, s2, s3)
      })
    })
  })
}



init(function (s1, s2, s3) {
  var consumer = require('./system/consumer/consumer')()
  consumer.mu.outbound({role: 's1'}, func({target: s1}))
  consumer.mu.outbound({role: 's2'}, func({target: s2}))
  consumer.mu.outbound({role: 's3'}, func({target: s3}))

  consumer.consume(function () {
    console.log('done')
    consumer.mu.tearDown()
    s1.tearDown()
    s2.tearDown()
    s3.tearDown()
  })
})

