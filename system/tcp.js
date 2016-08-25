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

/*
 * spin up services and consume them in using tcp transport
 */

var Mu = require('mu')

var s1 = require('./system/service1')(Mu())
s1.define('*', s1.transports.tcp({source: {port: 3001, host: '127.0.0.1'}}))

var s2 = require('./system/service2')(Mu())
s2.define('*', s2.transports.tcp({source: {port: 3002, host: '127.0.0.1'}}))

var consumer = require('./system/consumer')(Mu())
consumer.mu.define({role: 's2'}, consumer.mu.transports.tcp({target: {port: 3002, host: '127.0.0.1'}}))
consumer.mu.define({role: 's1'}, consumer.mu.transports.tcp({target: {port: 3001, host: '127.0.0.1'}}))

consumer.consume(function () {
  console.log('done')
  consumer.mu.tearDown()
  s1.tearDown()
  s2.tearDown()
})

