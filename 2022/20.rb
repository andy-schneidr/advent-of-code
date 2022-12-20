module Day20
  class << self
    def part_one(input)
      vals = []
      0.step(input.length-1, 1) { |i|
        vals << [input[i].to_i, i]
      }
      result = brute_the_thing(vals)
      zero_index = 0
      0.step(result.length-1, 1) { |i|
        # puts "hello?? #{result[i]}"
        if result[i][0] == 0
          zero_index = i
          puts "zero index: #{zero_index}"
          break
        end
      }
      thousand_1 = result[(zero_index + 1000) %result.length][0]
      thousand_2 = result[(zero_index + 2000) %result.length][0]
      thousand_3 = result[(zero_index + 3000) %result.length][0]
      puts "1000: #{thousand_1} 2000: #{thousand_2} 3000: #{thousand_3}"
      return thousand_1 + thousand_2 + thousand_3
    end

    def part_two(input)
      vals = []
      0.step(input.length-1, 1) { |i|
        vals << [input[i].to_i * 811589153, i]
      }
      result = vals
      10.times {
        result = brute_the_thing(result)
      }
      zero_index = 0
      0.step(result.length-1, 1) { |i|
        # puts "hello?? #{result[i]}"
        if result[i][0] == 0
          zero_index = i
          puts "zero index: #{zero_index}"
          break
        end
      }
      thousand_1 = result[(zero_index + 1000) %result.length][0]
      thousand_2 = result[(zero_index + 2000) %result.length][0]
      thousand_3 = result[(zero_index + 3000) %result.length][0]
      puts "1000: #{thousand_1} 2000: #{thousand_2} 3000: #{thousand_3}"
      return thousand_1 + thousand_2 + thousand_3
    end

    def brute_the_thing(vals)
      0.step(vals.length-1, 1) { |i|
        # find the element we need to move
        0.step(vals.length-1, 1) { |idx|
          if vals[idx][1] == i
            debug ""
            debug "Befor: #{vals.to_s}"
            extra = 0
            origin = idx
            destination = idx + vals[idx][0]
            # destination -= 1 if destination <= 0
            # destination += 1 if destination >= vals.length
            destination %= (vals.length - 1)
            # if idx + vals[idx][0] < 0
            #   extra = -1
            # end
            # if idx + vals[idx][0] > vals.length
            #   extra = 1
            # end
            # vals.insert((idx+vals[idx][0] + extra) % vals.length, vals.delete_at(idx))
            debug "moving #{vals[idx]} Destination: #{destination} Origin: #{origin}"
            vals.insert destination, vals.delete_at(origin)
            debug "After: #{vals.to_s}"
            break
          end
        }
      }
      return vals
    end

    $debug = false
    def debug(string)
      if $debug
        puts string
      end
    end
  end
end

lines = File.readlines("examples/20/20.txt")
# puts Day20.part_one(lines)
# lines = File.readlines("examples/20/21.txt")
# puts Day20.part_one(lines)
# lines = File.readlines("examples/20/22.txt")
# puts Day20.part_one(lines)
# lines = File.readlines("examples/20/23.txt")
# puts Day20.part_one(lines)
puts Day20.part_two(lines)
lines = File.readlines("inputs/20.txt")
# puts Day20.part_one(lines)
puts Day20.part_two(lines)
