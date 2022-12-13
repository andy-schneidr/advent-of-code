module Day13
  class << self
    def part_one(input)
      packets = parse_packets(input)
      sum = 0
      0.step(packets.length-1, 1) { |i|
        if compare(packets[i][0], packets[i][1]) == 1
          sum += i+1
        end
      }
      sum
    end

    def part_two(input)
      input = ["[[2]]","[[6]]", ""].concat(input)
      packets = parse_packets(input)

      all_packets = []
      0.step(packets.length-1, 1) { |i|
        all_packets.append(PacketWithID.new(packets[i][0], i*2))
        all_packets.append(PacketWithID.new(packets[i][1], i*2+1))
      }

      all_packets.sort! { |a, b| compare(b.packet, a.packet) }

      result = 1
      0.step(all_packets.length-1, 1) { |i|
        if all_packets[i].id == 0 ||
            all_packets[i].id == 1
          result *= (i+1)
        end
      }
      result
    end

    class PacketWithID
      attr_accessor :packet
      attr_accessor :id

      def initialize(packet, id)
        @id = id
        @packet = packet
      end
    end

    def parse_packets(input)
      pairs = []
      0.step(input.length-1, 3) { |i|
        packet_1 = parse_packet(input[i].strip)[0]
        packet_2 = parse_packet(input[i+1].strip)[0]
        pairs.append([
          packet_1,
          packet_2
        ])
      }
      return pairs
    end

    # returns the packet, and the current index in the text
    def parse_packet(text, i=1)
      result = []
      while i < text.length
        if text[i] == "["
          inner_result = parse_packet(text, i+1)
          result.append(inner_result[0])
          i = inner_result[1]
        elsif text[i] == ","
          i += 1
        elsif text[i] == "]"
          return [result, i+1]
        else
          # This is a number!
          num = text[i..text.length].scan(/\d+/)[0]
          i += num.length
          result.append(num.to_i)
        end
      end
    end


    # Recursive function, left and right can be integers or arrays
    def compare(left, right)
      # puts "Comparing #{left} and #{right}"
      if left.is_a?(Integer) && right.is_a?(Integer)
        if left  < right
          # puts "#{left} < #{right} RIGHT"
          return 1
        elsif left > right
          # puts "#{left} > #{right} WRONG"
          return -1
        else
          return 0
        end
      elsif !left.is_a?(Integer) && right.is_a?(Integer)
        # puts "converting #{right} to an array"
        right = [right]
      elsif left.is_a?(Integer) && !right.is_a?(Integer)
        # puts "converting #{left} to an array"
        left = [left]
      end
      # puts "Comparing #{left} and #{right} as arrays"
      i = 0
      while i < left.length && i < right.length
        comparison = compare(left[i], right[i])
        if comparison != 0
          return comparison
        end
        i += 1
      end
      # All of the comparisons were equal, judge based on length
      if left.length < right.length
        # puts "left side ran out of items, RIGHT"
        return 1
      elsif left.length > right.length
        # puts "right side ran out of items, WRONG"
        return -1
      else
        # puts "right and left lengths were even"
        return 0
      end

      "YOU PROBABLY MESSED UP"
      return 0
    end
  end
end

lines = File.readlines("examples/13/13.txt")
puts Day13.part_one(lines)
puts Day13.part_two(lines)
lines = File.readlines("inputs/13.txt")
puts Day13.part_one(lines)
puts Day13.part_two(lines)
